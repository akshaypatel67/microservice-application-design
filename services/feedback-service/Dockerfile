# Use the official Golang image
FROM golang:1.22

# Set the working directory inside the container
WORKDIR /app

# # Copy the Go application files to the container
COPY . .

ENV DATABASE_URL=postgresql://root@feedback-service-db:26257/defaultdb?sslmode=disable

RUN go mod init feedback-service

RUN go get github.com/lib/pq@latest
RUN go get google.golang.org/grpc
RUN go get gopkg.in/confluentinc/confluent-kafka-go.v1/kafka

# Download dependencies
RUN go mod download

# Build the Go application
RUN go build -o main .

# Expose the port the application runs on
EXPOSE 8081

# Command to run the executable
CMD ["./main"]