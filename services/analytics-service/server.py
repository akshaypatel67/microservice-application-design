import protos.grpc_compiled.analytics_pb2_grpc as pb2_grpc
import protos.grpc_compiled.analytics_pb2 as pb2
from analytics import get_event_popularity, get_user_demographics, get_user_demographics_feedback, get_event_trends, get_top_events
from google.protobuf import json_format
import json

class AnalyticsService(pb2_grpc.AnalyticsServicer):
    def __init__(self, *args, **kwargs):
        pass

    def Hoi(self, request, context):

        # get the string from the incoming request
        message = request.message
        result = f'Hoi, Server Running!!!'
        result = {'message': result}

        return pb2.Msg(**result)
    
    def GetEventPopularity(self, request, context):
        event_id = request.event_id

        event_popularity = get_event_popularity(user_id="patelakshay6702@gmail.com", event_id=event_id)
        result = parse_map(event_popularity, pb2.EventPopularityBody)

        return pb2.EventPopularityResponse(event_popularity=result)
    
    def GetUserDemographics(self, request, context):
        event_id = request.event_id

        user_demographics = get_user_demographics(user_id="patelakshay6702@gmail.com", event_id=event_id)
        result = parse_map(user_demographics, pb2.UserDemographicsBody)

        return pb2.UserDemographicsResponse(user_demographics=result)
    
    def GetUserDemographicsFeedback(self, request, context):
        event_id = request.event_id

        user_demographics_feedback = get_user_demographics_feedback(user_id="patelakshay6702@gmail.com", event_id=event_id)
        result = parse_map(user_demographics_feedback, pb2.UserDemographicsBody)

        return pb2.UserDemographicsResponse(user_demographics=result)
    
    def GetEventTrends(self, request, context):
        event_id = request.event_id
        period = request.period

        event_trends = get_event_trends(user_id="patelakshay6702@gmail.com", time_range=period, event_id=event_id)
        result = {}
        for key, value in event_trends.items():
            result[key] = json_format.Parse(json.dumps({"period_wise_booking": value}), pb2.EventTrendsBody())

        return pb2.EventTrendsResponse(event_trends=result)
    
    def GetTopEvents(self, request, context):
        top_events = get_top_events(user_id="patelakshay6702@gmail.com")
        return pb2.TopEventsResponse(top_events=top_events)
    

def parse_map(data, proto_msg_format):
    result = {}
    for key, value in data.items():
        result[key] = json_format.Parse(json.dumps(value), proto_msg_format())
    return result
