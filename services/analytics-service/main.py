import logging
import threading

import grpc
from concurrent import futures
import protos.grpc_compiled.analytics_pb2_grpc as pb2_grpc

from consumers.base_kafka_consumer import BaseConsumer
from consumers.visit_event_consumer import process_message as process_visit_event_message
from consumers.ticket_status_event_consumer import process_message as process_ticket_status_event_message
from consumers.upsert_data_consumer import process_message as process_upsert_data_event_message
from consumers.feedback_event_consumer import process_message as process_feedback_event_message

from server import AnalyticsService

import http_server

from db.connection import engine, session
from db.models import create_models

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

def start_consumers():
    def start_consumer(topic, process_message):
        """Function to start a Kafka consumer for a specific topic."""
        logging.info(f"Starting consumer for topic: {topic}")
        consumer = BaseConsumer(topic=topic, process_message=process_message)
        consumer.start()

    # Define consumers for different topics
    consumers = [
        threading.Thread(target=start_consumer, args=("visit-event", process_visit_event_message)),
        threading.Thread(target=start_consumer, args=("ticket-status-event", process_ticket_status_event_message)),
        threading.Thread(target=start_consumer, args=("upsert-data", process_upsert_data_event_message)),
        threading.Thread(target=start_consumer, args=("feedback-event", process_feedback_event_message)),
    ]

    # Start all consumer threads
    for consumer_thread in consumers:
        consumer_thread.start()

    # Keep the main thread alive while consumers are running
    for consumer_thread in consumers:
        consumer_thread.join()

def main():
    """Main function to start all consumers."""
    logging.info("Starting analytics service...")

    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    pb2_grpc.add_AnalyticsServicer_to_server(AnalyticsService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    logging.info("Starting grpc server...")

    http_server_thread = threading.Thread(target=http_server.app.run, args=('0.0.0.0', 8000))
    http_server_thread.start()

    create_models(engine)
    
    start_consumers()
    server.wait_for_termination()

if __name__ == "__main__":
    main()
