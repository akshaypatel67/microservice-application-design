import json
import logging
from db.models import Feedback
from db.connection import session

def process_message(message, key=None):
    try:
        message = json.loads(message)
        logging.info(f"[feedback-event] Received data: {message}")

        feedback = Feedback(**message)

        session.add(feedback)
        session.commit()

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except KeyError as e:
        print(f"KeyError: {e}")

