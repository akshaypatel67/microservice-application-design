from confluent_kafka import Consumer
import logging
import json

conf = {
    'bootstrap.servers': 'kafka-cluster.default.svc.cluster.local:9092',
    'group.id': 'analytics_service_group',
    'auto.offset.reset': 'earliest'
}

class BaseConsumer:
    def __init__(self, topic, process_message):
        self.topic = topic
        self.consumer = Consumer(conf)
        self.process_message = process_message

    def start(self):
        self.consumer.subscribe([self.topic])
        try:
            while True:
                msg = self.consumer.poll(1.0)  # Poll for new messages
                if msg is None:
                    continue
                if msg.error():
                    logging.error(f"Consumer error: {msg.error()}")
                    continue
                self.process_message(message=msg.value().decode('utf-8'), key=(msg.key() or b"").decode('utf-8'))
        except json.JSONDecodeError as e:
            logging.error(f"Error decoding JSON: {e}")
        except KeyboardInterrupt:
            logging.info("Shutting down consumer...")
        except Exception as e:
            logging.error(str(e))
        finally:
            self.consumer.close()
