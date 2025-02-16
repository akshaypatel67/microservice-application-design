import json
import logging
from db.models import Event, User
from db.connection import session
from datetime import datetime

EVENT_FIELDS = ['id', 'name', 'date', 'location', 'price', 'user_id', 'created_on', 'updated_on']
USER_FIELDS = ['id', 'name', 'gender', 'age', 'email']

def process_message(message, key=None):
    try:
        message = json.loads(message)
        logging.info(f"[upsert-data-event] Received (key: {key}) message: {message}")

        if key == "event":
            event_data = { key: value for key, value in message.items() if key in EVENT_FIELDS }
            if 'date' in message.keys():
                event_data['date'] = datetime.fromtimestamp(int(message.get('date')))
            event = session.query(Event).filter(Event.id == message.get("id")).first()

            if event:
                del event_data['id']
                
                for key, value in event_data.items():
                    if hasattr(event, key):
                        setattr(event, key, value)
            else:
                event = Event(**event_data)
                session.add(event)
            session.commit()
        elif key == "user":
            user_data = { key: value for key, value in message.items() if key in USER_FIELDS }
            user = session.query(User).filter(User.email == message.get("email")).first()

            if user:
                for key, value in user_data.items():
                    if hasattr(user, key):
                        setattr(user, key, value)
            else:
                user = User(**user_data)
                session.add(user)
            session.commit()

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except KeyError as e:
        print(f"KeyError: {e}")

# def prepare_event_data(message):
#     event_data = {}

#     for key, message_key in event_map.items():
#         if type(message_key) is list:
#             present = True
#             val = message
#             for k in message_key:
#                 if k in val:
#                     val = val.get(k)
#                 else:
#                     present = False
#                     break
#             if present:
#                 event_data[key] = val
#         else:
#             if message_key in message:
#                 if message_key == "date":
#                     event_data[key] = datetime.fromtimestamp(int(message.get(message_key)))
#                 else:
#                     event_data[key] = message.get(message_key)

#     return event_data