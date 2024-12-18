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
  ROUTE_NAME=$3

  # echo $SERVICE_NAME
  # echo $NEW_PATH

  curl -i -X POST --url http://kong:8001/services/${SERVICE_NAME}/routes --data "paths[]=${NEW_PATH}" --data "name=${ROUTE_NAME}"
}

# Function to add jwt plugin to a service
add_jwt() {
  SERVICE_NAME=$1

  # echo $SERVICE_NAME

  curl -i -X POST --url http://kong:8001/services/${SERVICE_NAME}/plugins --data "name=jwt" --data "config.key_claim_name=key" --data "config.claims_to_verify=exp" #--data "config.header_names[]=authorization" --data "config.header_names[]=user"
}

# Function to add grpc plugin to a service
add_grpc() {
  SERVICE_NAME=$1
  PROTO=$2

  # echo $SERVICE_NAME

  curl -i -X POST --url http://kong:8001/services/${SERVICE_NAME}/plugins --data "name=grpc-gateway" --data "config.proto=/kong/${PROTO}.proto"
}

# Function to add jwt2header plugin for all services
add_jwt2header() {
  curl -i -X POST --url http://kong:8001/plugins --data "name=kong-jwt2header" --data "config.token_required=false"
}

# Function to continuously try the curl command until a failed response is received
retry_curl() {
  while true; do
    curl -i -X POST --url http://kong:8001/consumers --data "username=test" --data "custom_id=test"
    if [ $? -ne 0 ]; then
      echo "Failed to connect to Kong, retrying..."
    else
      break
    fi
    sleep 5
  done
}

# Call the retry_curl function
retry_curl

# Add services and routes to kong
add_service "user-service" "http://user-service:8001/auth/"
add_route "user-service" "/auth" "auth-route"

add_service "event-service" "grpc://event-service:50051"
add_route "event-service" "/event" "event-route"

add_service "ticket-service" "grpc://ticket-service:50051"
add_route "ticket-service" "/ticket" "ticket-route"

add_service "feedback-service" "grpc://feedback-service:50051"
add_route "feedback-service" "/feedback" "feedback-route" 

# Add JWT plugin to services
add_jwt "event-service"
add_jwt "ticket-service"
add_jwt "feedback-service"

# Add GRPC plugin to services
add_grpc "event-service" "event"
add_grpc "ticket-service" "ticket"
add_grpc "feedback-service" "feedback"

# Add JWT2HEADER plugin for all services
add_jwt2header

echo "kong configured"