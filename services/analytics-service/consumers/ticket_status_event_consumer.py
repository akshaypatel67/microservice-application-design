import json
import logging
from db.models import TicketHistory, TicketStatus
from db.connection import session

def process_message(message, key=None):
    try:
        message = json.loads(message)
        logging.info(f"[ticket-status-event] Received (key: {key}) message: {message}")

        ticket_history = TicketHistory(
            event_id = message.get("event_id"),
            user_id = message.get("user_id"),
            ticket_id = message.get("ticket_id"),
            ticket_status = TicketStatus.BOOKED if key == "booking" else TicketStatus.CANCELLED
        )

        session.add(ticket_history)
        session.commit()

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except KeyError as e:
        print(f"KeyError: {e}")
