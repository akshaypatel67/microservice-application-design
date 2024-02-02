from confluent_kafka import Consumer, KafkaError
import json
from google.protobuf.json_format import Parse
import requests
from flask import Flask, jsonify
from threading import Thread
import firebase_admin
from firebase_admin import credentials, firestore

import event_pb2, ticket_pb2
import event_pb2_grpc, ticket_pb2_grpc
import grpc

app = Flask(__name__)

conf = {
    'bootstrap.servers': 'kafka:9092',
    'group.id': 'analytics_service_group',
    'auto.offset.reset': 'earliest'
}

topic = 'ticket-success-event'

user_service_endpoint = 'http://your_user_service_endpoint'
event_service_address = 'localhost:8001'
ticket_service_address = 'localhost:8002'

temporary_data = {}

# Initialize Firebase
cred = credentials.Certificate("analytics-service/analytics-service-48259-firebase-adminsdk-o4g5b-78c09cff3e.json")  # Replace with your Firebase credentials path
firebase_admin.initialize_app(cred)

def push_dummy_data():
    try:
        db = firestore.client()

        # Replace 'your_collection_name' with the actual name you want for the collection
        # Replace 'your_document_id' with the actual ID you want for the document
        data = {
            'field1': 'value1',
            'field2': 'value2',
            'field3': 'value3',
        }

        # Push data to Firestore
        db.collection('your_collection_name').document('your_document_id').set(data)

        print("Dummy data pushed successfully to Firestore.")

    except Exception as e:
        print(f"Error pushing data to Firestore: {e}")

# Function to get dummy data from Firebase Firestore
def get_dummy_data():
    try:
        db = firestore.client()

        # Replace 'your_collection_name' and 'your_document_id' with the actual names
        doc_ref = db.collection('your_collection_name').document('your_document_id')

        # Get data from Firestore
        doc = doc_ref.get()

        if doc.exists:
            data = doc.to_dict()
            print("Dummy data retrieved from Firestore:", data)
        else:
            print("Document does not exist.")

    except Exception as e:
        print(f"Error getting data from Firestore: {e}")


def consume_kafka_message(message):
    try:
        kafka_data = json.loads(message.value().decode('utf-8'))

        ticket_id = kafka_data['ticket_id']
        user_id = kafka_data['user_id']
        event_id = kafka_data['event_id']

        # user_data = get_user_data(user_id)
        event_data = get_event_data(event_id)
        ticket_data = get_ticket_data(ticket_id)

        print(event_data, ticket_data)

        save_temporary_data(ticket_id, user_id, event_id, event_data)

        analyze_and_log_to_firestore()

    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
    except KeyError as e:
        print(f"KeyError: {e}")

def get_user_data(user_id):
    response = requests.get(f'{user_service_endpoint}/user/{user_id}')

    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching user data. Status code: {response.status_code}")
        return None

def get_event_data(event_id):
    with grpc.insecure_channel(event_service_address) as channel:
        stub = event_pb2_grpc.EventServiceStub(channel)
        response = stub.GetEvent(event_pb2.EventId(id=event_id))
        return response

def get_ticket_data(ticket_id, user_id):
    with grpc.insecure_channel(ticket_service_address) as channel:
        stub = ticket_pb2_grpc.TicketServiceStub(channel)
        response = stub.GetTicket(ticket_pb2.TicketRequest(ticket_id=ticket_id, user_id=user_id))
        return response

def save_temporary_data(ticket_id, user_id, event_id, event_data):
    global temporary_data
    temporary_data = {
        'ticket_id': ticket_id,
        'user_id': user_id,
        'event_id': event_id,
        'event_data': event_data,
    }


def analyze_and_log_to_firestore():
    global temporary_data
    print(temporary_data)

    if temporary_data:
        try:
            db = firestore.client()

            ticket_id = temporary_data['ticket_id']
            user_id = temporary_data['user_id']
            event_id = temporary_data['event_id']
            event_data = temporary_data['event_data']

            analyze_user_service(db, user_id)
            analyze_event_service(db, event_id)
            analyze_ticketing_service(db, ticket_id)

            db.collection('analytics_log').add({
                'ticket_id': ticket_id,
                'user_id': user_id,
                'event_id': event_id,
                'event_data': event_data.SerializeToString(),
            })

        except Exception as e:
            print(f"Error logging to Firestore: {e}")

        finally:
            temporary_data = {}

def analyze_user_service(db, user_id):
    user_data = get_user_data(user_id)
    print("User Service Analytics:", user_data)

def analyze_event_service(db, event_id):
    event_data = get_event_data(event_id)
    print("Event Service Analytics:", event_data)

def analyze_ticketing_service(db, ticket_id):
    ticket_data = get_ticket_data(ticket_id)
    print("Ticketing Service Analytics:", ticket_data)

@app.route('/analytics', methods=['GET'])
def get_analytics():
    return jsonify({})

if __name__ == '__main__':
    # consumer = Consumer(conf)
    # consumer.subscribe([topic])

    # Thread(target=app.run, kwargs={'port': 5001}).start()

    try:
        push_dummy_data()
        get_dummy_data()
    #     while True:
    #         msg = consumer.poll(1.0)

    #         if msg is None:
    #             continue
    #         if msg.error():
    #             if msg.error().code() == KafkaError._PARTITION_EOF:
    #                 continue
    #             else:
    #                 print(msg.error())
    #                 break

    #         consume_kafka_message(msg)

    except KeyboardInterrupt:
        pass
    # finally:
    #     consumer.close()