import json
import logging
from db.models import EventHistory
from db.connection import session
from datetime import datetime

def process_message(message, key=None):
    try:
        message = json.loads(message)
        logging.info(f"[visit-event] Received data: {message}")

        event_history = EventHistory(
            event_id = key,
            user_id = message.get("user_id"),
            visit_time = datetime.fromtimestamp(int(message.get("visit_time")) / 1000),
        )

        session.add(event_history)
        session.commit()

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except KeyError as e:
        print(f"KeyError: {e}")

