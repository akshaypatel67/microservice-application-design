#!/bin/bash

# Function to add a service to Kong
add_service() {
  SERVICE_NAME=$1
  UPSTREAM_URL=$2

  curl -i -X POST --url http://kong:8001/services/ --data "name=${SERVICE_NAME}" --data "url=${UPSTREAM_URL}"
}

# Function to add a route to Kong
add_route() {
  SERVICE_NAME=$1
  NEW_PATH=$2

  echo $SERVICE_NAME
  echo $NEW_PATH

  curl -i -X POST --url http://kong:8001/services/${SERVICE_NAME}/routes --data "paths[]=${NEW_PATH}"
}

# Function to add a route to Kong
add_jwt() {
  SERVICE_NAME=$1

  echo $SERVICE_NAME

  curl -i -X POST --url http://kong:8001/services/${SERVICE_NAME}/plugins --data "name=jwt" --data "config.key_claim_name=key"
}

add_grpc() {
  SERVICE_NAME=$1
  PROTO=$2

  echo $SERVICE_NAME

  curl -i -X POST --url http://kong:8001/services/${SERVICE_NAME}/plugins --data "name=grpc-gateway" --data "config.proto=/kong/${PROTO}.proto"
}

curl -i -X POST --url http://kong:8001/consumers --data "username=test" --data "custom_id=test"

add_service "user-service" "http://user-service:8001/auth/"
add_route "user-service" "/auth"

add_service "event-service" "grpc://event-service:50051"
add_route "event-service" "/event"

add_service "ticket-service" "grpc://ticket-service:50051"
add_route "ticket-service" "/ticket"

add_service "feedback-service" "grpc://feedback-service:50051"
add_route "feedback-service" "/feedback"

# add_jwt "event-service"
add_grpc "event-service" "event"
add_grpc "ticket-service" "ticket"
add_grpc "feedback-service" "feedback"

# add_service "api-url" "http://api:8001/users/"
# add_route "api-url" "/users"

# add_service "api-url" "http://api:8001/users/"
# add_route "api-url" "/users"