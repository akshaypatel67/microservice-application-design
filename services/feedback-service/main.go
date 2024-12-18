package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net"
	"os"

	pb "feedback-service/pb/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"google.golang.org/grpc/codes"

	"github.com/confluentinc/confluent-kafka-go/kafka"

	_ "github.com/lib/pq"
)

var connDb *sql.DB
var producer *kafka.Producer

const (
	port = ":50051"
)

type FeedbackServiceServer struct {
	pb.UnimplementedFeedbackServiceServer
}

func (s *FeedbackServiceServer) GetFeedbacks(ctx context.Context, in *pb.EventRequest) (*pb.Feedbacks, error) {
	eventId := in.GetEventId()

	if eventId == "" {
		return nil, status.Errorf(codes.InvalidArgument, "no event id found")
	}

	fmt.Println("Records for event_id ", eventId)

	records, err := selectRecordsByEventID(connDb, eventId)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println(records)

	var objects []*pb.Feedback

	for _, record := range records {
		fmt.Printf("Ticket ID: %s, User ID: %s, Ratings: %d\n", record.TicketID, record.UserID, record.Ratings)

		objects = append(objects, &pb.Feedback{
			TicketId: record.TicketID,
			UserId:   record.UserID,
			EventId:  record.EventID,
			Rating:   int32(record.Ratings),
			Description: record.Description,
		})
	}

	// var reply string = "Reply for message: " + in.GetMsg()
	// objects := []*pb.Feedback{
	// 	{EventId: "123", UserId: "456"},
	// 	{EventId: "123", UserId: "456"},
	// 	{EventId: "123", UserId: "456"},
	// 	// Add more objects as needed
	// }
	return &pb.Feedbacks{Feedbacks: objects}, nil
}

func (s *FeedbackServiceServer) CreateFeedback(ctx context.Context, in *pb.Feedback) (*pb.Response, error) {
	md, ok := metadata.FromIncomingContext(ctx)
	if !ok {
        return nil, status.Errorf(codes.InvalidArgument, "no metadata found")
    }

	var claim_userId string
    if values := md["x-kong-jwt-claim-user"]; len(values) > 0 {
        claim_userId = values[0]
    } else {
        return nil, status.Errorf(codes.Unauthenticated, "x-kong-jwt-claim-user not found in metadata")
    }

	eventId := in.GetEventId()
	ticketId := in.GetTicketId()
	ratings := int(in.GetRating())
	description := in.GetDescription()
	userId := claim_userId

	err := insertRecord(connDb, ticketId, eventId, userId, ratings, description)

	if err != nil {
		log.Fatal(err)
	}

	return &pb.Response{ Msg: "success", }, nil
}

type Record struct {
	TicketID string
	EventID  string
	UserID   string
	Ratings  int
	Description string
}

func createTable(db *sql.DB) error {
	createTable := `
		CREATE TABLE IF NOT EXISTS feedback (
			ticket_id VARCHAR(255),
			event_id  VARCHAR(255),
			user_id   VARCHAR(255),
			ratings INT,
			description VARCHAR,
			UNIQUE (event_id, user_id)
		)
	`

	// Execute the SQL statement to create the table
	_, err := connDb.Exec(createTable)
	if err != nil {
		return err
	}

	return nil
}

func produceKafkaMsg(topic, value string) error {
	delivery_chan := make(chan kafka.Event, 10000)
	producer.Produce(&kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Value: []byte(value)},
		delivery_chan,
	)

	e := <-delivery_chan
	m := e.(*kafka.Message)

	if m.TopicPartition.Error != nil {
		fmt.Printf("Delivery failed: %v\n", m.TopicPartition.Error)
	} else {
		fmt.Printf("Delivered message to topic %s [%d] at offset %v\n",
				*m.TopicPartition.Topic, m.TopicPartition.Partition, m.TopicPartition.Offset)
	}
	close(delivery_chan)

	return nil
}

func insertRecord(db *sql.DB, ticketID, eventID, userID string, ratings int, description string) error {
	// Insert a record into the feedback table
	insertRecord := `
		INSERT INTO feedback (ticket_id, event_id, user_id, ratings, description) VALUES ($1, $2, $3, $4, $5)
	`

	// Execute the SQL statement to insert the record
	_, err := connDb.Exec(insertRecord, ticketID, eventID, userID, ratings, description)
	if err != nil {
		return err
	}

	eventMsg := fmt.Sprintf(`{
		"id" : "%s",
		"event_id" : "%s",
		"user_id" : "%s",
		"ratings" : "%d",
		"description" : "%s"
	}`, ticketID, eventID, userID, ratings, description)

	produceKafkaMsg("feedback-event", eventMsg)

	return nil
}

func selectRecordsByEventID(db *sql.DB, eventID string) ([]Record, error) {
	// Prepare the SQL statement for selecting records by event_id
	selectRecords := `
		SELECT ticket_id, event_id, user_id, ratings, description FROM feedback WHERE event_id = $1
	`
	stmt, err := connDb.Prepare(selectRecords)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	// Execute the prepared statement to select records
	rows, err := stmt.Query(eventID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// Iterate through the result set and populate records
	var records []Record
	for rows.Next() {
		var record Record
		err := rows.Scan(&record.TicketID, &record.EventID, &record.UserID, &record.Ratings, &record.Description)
		if err != nil {
			return nil, err
		}
		records = append(records, record)
		fmt.Println(record)
	}

	return records, nil
}

func main() {
	var err error
	producer, err = kafka.NewProducer(&kafka.ConfigMap{
		"bootstrap.servers": "kafka:9092",
		"client.id": "feedback-producer",
		"acks": "all"})
	
	if err != nil {
		fmt.Printf("Failed to create producer: %s\n", err)
		os.Exit(1)
	}

	connStr := os.Getenv("DATABASE_URL")
	fmt.Println(connStr)

	// Connect to the CockroachDB database
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}

	connDb = db

	defer connDb.Close()

	// Ping the database to check the connection
	err = connDb.Ping()
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Connected to CockroachDB!")

	// Create a table into database.
	err = createTable(db)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Table 'feedback' created successfully!")

	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()
	pb.RegisterFeedbackServiceServer(s, &FeedbackServiceServer{})
	log.Printf("server listening at %v", lis.Addr())
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}

	


	// to produce messages
	// topic := "my-topic"
	// partition := 0

	// conn, err := kafka.DialLeader(context.Background(), "tcp", "kafka:9092", topic, partition)
	// if err != nil {
	// 	log.Fatal("failed to dial leader:", err)
	// }

	// conn.SetWriteDeadline(time.Now().Add(10*time.Second))
	// _, err = conn.WriteMessages(
	// 	kafka.Message{Value: []byte("one!")},
	// 	kafka.Message{Value: []byte("two!")},
	// 	kafka.Message{Value: []byte("three!")},
	// )

	// if err != nil {
	// 	log.Fatal("failed to write messages:", err)
	// }
	
	// if err := conn.Close(); err != nil {
	// 	log.Fatal("failed to close writer:", err)
	// }

	

}

// protoc --go_out=pb --go_opt=paths=source_relative --go-grpc_out=pb --go-grpc_opt=paths=source_relative proto/*.proto
