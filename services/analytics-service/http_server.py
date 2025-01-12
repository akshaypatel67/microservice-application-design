from flask import Flask, request, jsonify
import grpc
import protos.grpc_compiled.analytics_pb2 as pb2
import protos.grpc_compiled.analytics_pb2_grpc as pb2_grpc
from google.protobuf.json_format import MessageToDict, ParseDict

app = Flask(__name__)

def get_stub():
    channel = grpc.insecure_channel("localhost:50051")
    return pb2_grpc.AnalyticsStub(channel)

def call_grpc(pb2_req, pb2_res):
    grpc_request = ParseDict(request.get_json(), pb2_req())
    grpc_response = pb2_res(grpc_request)
    return MessageToDict(grpc_response)

@app.route('/analytics/event_popularity', methods=['POST'])
def event_popularity():
    grpc_stub = get_stub()
    return call_grpc(
        pb2_req=pb2.EventIdRequest, 
        pb2_res=grpc_stub.GetEventPopularity
    )

@app.route('/analytics/user_demographics', methods=['POST'])
def user_demographics():
    grpc_stub = get_stub()
    return call_grpc(
        pb2_req=pb2.EventIdRequest, 
        pb2_res=grpc_stub.GetUserDemographics
    )

@app.route('/analytics/user_demographics_feedback', methods=['POST'])
def user_demographics_feedback():
    grpc_stub = get_stub()
    return call_grpc(
        pb2_req=pb2.EventIdRequest, 
        pb2_res=grpc_stub.GetUserDemographicsFeedback
    )

@app.route('/analytics/event_trends', methods=['POST'])
def event_trends():
    grpc_stub = get_stub()
    return call_grpc(
        pb2_req=pb2.EventTrendsRequest, 
        pb2_res=grpc_stub.GetEventTrends
    )

@app.route('/analytics/top_events', methods=['POST'])
def top_events():
    grpc_stub = get_stub()
    return call_grpc(
        pb2_req=pb2.EmptyMessage, 
        pb2_res=grpc_stub.GetTopEvents
    )
