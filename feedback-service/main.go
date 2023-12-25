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

	_ "github.com/lib/pq"
)

var connDb *sql.DB

const (
	port = ":50051"
)

type FeedbackServiceServer struct {
	pb.UnimplementedFeedbackServiceServer
}

func (s *FeedbackServiceServer) GetFeedbacks(ctx context.Context, in *pb.EventRequest) (*pb.Feedbacks, error) {
	eventId := in.GetEventId()

	fmt.Println("Records for event_id %s", eventId)

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
			Rating:   int32(record.Ratings),
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

type Record struct {
	TicketID string
	EventID  string
	UserID   string
	Ratings  int
}

func createTable(db *sql.DB) error {
	createTable := `
		CREATE TABLE IF NOT EXISTS feedback (
			ticket_id VARCHAR(255) PRIMARY KEY,
			event_id  VARCHAR(255),
			user_id   VARCHAR(255),
			ratings INT,
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

func insertRecord(db *sql.DB, ticketID, eventID, userID string, ratings int) error {
	// Insert a record into the feedback table
	insertRecord := `
		INSERT INTO feedback (ticket_id, event_id, user_id, ratings) VALUES ($1, $2, $3, $4)
	`

	// Execute the SQL statement to insert the record
	_, err := connDb.Exec(insertRecord, ticketID, eventID, userID, ratings)
	if err != nil {
		return err
	}

	return nil
}

func selectRecordsByEventID(db *sql.DB, eventID string) ([]Record, error) {
	// Prepare the SQL statement for selecting records by event_id
	selectRecords := `
		SELECT ticket_id, event_id, user_id, ratings FROM feedback WHERE event_id = $1
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
		err := rows.Scan(&record.TicketID, &record.EventID, &record.UserID, &record.Ratings)
		if err != nil {
			return nil, err
		}
		records = append(records, record)
		fmt.Println(record)
	}

	return records, nil
}

func main() {
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
}

// protoc --go_out=pb --go_opt=paths=source_relative --go-grpc_out=pb --go-grpc_opt=paths=source_relative proto/*.proto
