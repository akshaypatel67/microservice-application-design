# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc
import warnings

from . import analytics_pb2 as analytics__pb2

GRPC_GENERATED_VERSION = '1.69.0'
GRPC_VERSION = grpc.__version__
_version_not_supported = False

try:
    from grpc._utilities import first_version_is_lower
    _version_not_supported = first_version_is_lower(GRPC_VERSION, GRPC_GENERATED_VERSION)
except ImportError:
    _version_not_supported = True

if _version_not_supported:
    raise RuntimeError(
        f'The grpc package installed is at version {GRPC_VERSION},'
        + f' but the generated code in analytics_pb2_grpc.py depends on'
        + f' grpcio>={GRPC_GENERATED_VERSION}.'
        + f' Please upgrade your grpc module to grpcio>={GRPC_GENERATED_VERSION}'
        + f' or downgrade your generated code using grpcio-tools<={GRPC_VERSION}.'
    )


class AnalyticsStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.Hoi = channel.unary_unary(
                '/analytics.Analytics/Hoi',
                request_serializer=analytics__pb2.Msg.SerializeToString,
                response_deserializer=analytics__pb2.Msg.FromString,
                _registered_method=True)
        self.GetEventPopularity = channel.unary_unary(
                '/analytics.Analytics/GetEventPopularity',
                request_serializer=analytics__pb2.EventIdRequest.SerializeToString,
                response_deserializer=analytics__pb2.EventPopularityResponse.FromString,
                _registered_method=True)
        self.GetUserDemographics = channel.unary_unary(
                '/analytics.Analytics/GetUserDemographics',
                request_serializer=analytics__pb2.EventIdRequest.SerializeToString,
                response_deserializer=analytics__pb2.UserDemographicsResponse.FromString,
                _registered_method=True)
        self.GetUserDemographicsFeedback = channel.unary_unary(
                '/analytics.Analytics/GetUserDemographicsFeedback',
                request_serializer=analytics__pb2.EventIdRequest.SerializeToString,
                response_deserializer=analytics__pb2.UserDemographicsResponse.FromString,
                _registered_method=True)
        self.GetEventTrends = channel.unary_unary(
                '/analytics.Analytics/GetEventTrends',
                request_serializer=analytics__pb2.EventTrendsRequest.SerializeToString,
                response_deserializer=analytics__pb2.EventTrendsResponse.FromString,
                _registered_method=True)
        self.GetTopEvents = channel.unary_unary(
                '/analytics.Analytics/GetTopEvents',
                request_serializer=analytics__pb2.EmptyMessage.SerializeToString,
                response_deserializer=analytics__pb2.TopEventsResponse.FromString,
                _registered_method=True)


class AnalyticsServicer(object):
    """Missing associated documentation comment in .proto file."""

    def Hoi(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetEventPopularity(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetUserDemographics(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetUserDemographicsFeedback(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetEventTrends(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetTopEvents(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_AnalyticsServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'Hoi': grpc.unary_unary_rpc_method_handler(
                    servicer.Hoi,
                    request_deserializer=analytics__pb2.Msg.FromString,
                    response_serializer=analytics__pb2.Msg.SerializeToString,
            ),
            'GetEventPopularity': grpc.unary_unary_rpc_method_handler(
                    servicer.GetEventPopularity,
                    request_deserializer=analytics__pb2.EventIdRequest.FromString,
                    response_serializer=analytics__pb2.EventPopularityResponse.SerializeToString,
            ),
            'GetUserDemographics': grpc.unary_unary_rpc_method_handler(
                    servicer.GetUserDemographics,
                    request_deserializer=analytics__pb2.EventIdRequest.FromString,
                    response_serializer=analytics__pb2.UserDemographicsResponse.SerializeToString,
            ),
            'GetUserDemographicsFeedback': grpc.unary_unary_rpc_method_handler(
                    servicer.GetUserDemographicsFeedback,
                    request_deserializer=analytics__pb2.EventIdRequest.FromString,
                    response_serializer=analytics__pb2.UserDemographicsResponse.SerializeToString,
            ),
            'GetEventTrends': grpc.unary_unary_rpc_method_handler(
                    servicer.GetEventTrends,
                    request_deserializer=analytics__pb2.EventTrendsRequest.FromString,
                    response_serializer=analytics__pb2.EventTrendsResponse.SerializeToString,
            ),
            'GetTopEvents': grpc.unary_unary_rpc_method_handler(
                    servicer.GetTopEvents,
                    request_deserializer=analytics__pb2.EmptyMessage.FromString,
                    response_serializer=analytics__pb2.TopEventsResponse.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'analytics.Analytics', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))
    server.add_registered_method_handlers('analytics.Analytics', rpc_method_handlers)


 # This class is part of an EXPERIMENTAL API.
class Analytics(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def Hoi(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/analytics.Analytics/Hoi',
            analytics__pb2.Msg.SerializeToString,
            analytics__pb2.Msg.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)

    @staticmethod
    def GetEventPopularity(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/analytics.Analytics/GetEventPopularity',
            analytics__pb2.EventIdRequest.SerializeToString,
            analytics__pb2.EventPopularityResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)

    @staticmethod
    def GetUserDemographics(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/analytics.Analytics/GetUserDemographics',
            analytics__pb2.EventIdRequest.SerializeToString,
            analytics__pb2.UserDemographicsResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)

    @staticmethod
    def GetUserDemographicsFeedback(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/analytics.Analytics/GetUserDemographicsFeedback',
            analytics__pb2.EventIdRequest.SerializeToString,
            analytics__pb2.UserDemographicsResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)

    @staticmethod
    def GetEventTrends(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/analytics.Analytics/GetEventTrends',
            analytics__pb2.EventTrendsRequest.SerializeToString,
            analytics__pb2.EventTrendsResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)

    @staticmethod
    def GetTopEvents(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(
            request,
            target,
            '/analytics.Analytics/GetTopEvents',
            analytics__pb2.EmptyMessage.SerializeToString,
            analytics__pb2.TopEventsResponse.FromString,
            options,
            channel_credentials,
            insecure,
            call_credentials,
            compression,
            wait_for_ready,
            timeout,
            metadata,
            _registered_method=True)
