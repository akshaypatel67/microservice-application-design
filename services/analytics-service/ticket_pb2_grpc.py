# Generated by the gRPC Python protocol compiler plugin. DO NOT EDIT!
"""Client and server classes corresponding to protobuf-defined services."""
import grpc

import ticket_pb2 as ticket__pb2


class TicketServiceStub(object):
    """Missing associated documentation comment in .proto file."""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.BookTicket = channel.unary_unary(
                '/ticket.TicketService/BookTicket',
                request_serializer=ticket__pb2.EventRequest.SerializeToString,
                response_deserializer=ticket__pb2.Ticket.FromString,
                )
        self.CancelTicket = channel.unary_unary(
                '/ticket.TicketService/CancelTicket',
                request_serializer=ticket__pb2.TicketRequest.SerializeToString,
                response_deserializer=ticket__pb2.TicketResponse.FromString,
                )
        self.GetTicket = channel.unary_unary(
                '/ticket.TicketService/GetTicket',
                request_serializer=ticket__pb2.TicketRequest.SerializeToString,
                response_deserializer=ticket__pb2.Ticket.FromString,
                )
        self.GetTickets = channel.unary_stream(
                '/ticket.TicketService/GetTickets',
                request_serializer=ticket__pb2.EventRequest.SerializeToString,
                response_deserializer=ticket__pb2.Ticket.FromString,
                )


class TicketServiceServicer(object):
    """Missing associated documentation comment in .proto file."""

    def BookTicket(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def CancelTicket(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetTicket(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')

    def GetTickets(self, request, context):
        """Missing associated documentation comment in .proto file."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_TicketServiceServicer_to_server(servicer, server):
    rpc_method_handlers = {
            'BookTicket': grpc.unary_unary_rpc_method_handler(
                    servicer.BookTicket,
                    request_deserializer=ticket__pb2.EventRequest.FromString,
                    response_serializer=ticket__pb2.Ticket.SerializeToString,
            ),
            'CancelTicket': grpc.unary_unary_rpc_method_handler(
                    servicer.CancelTicket,
                    request_deserializer=ticket__pb2.TicketRequest.FromString,
                    response_serializer=ticket__pb2.TicketResponse.SerializeToString,
            ),
            'GetTicket': grpc.unary_unary_rpc_method_handler(
                    servicer.GetTicket,
                    request_deserializer=ticket__pb2.TicketRequest.FromString,
                    response_serializer=ticket__pb2.Ticket.SerializeToString,
            ),
            'GetTickets': grpc.unary_stream_rpc_method_handler(
                    servicer.GetTickets,
                    request_deserializer=ticket__pb2.EventRequest.FromString,
                    response_serializer=ticket__pb2.Ticket.SerializeToString,
            ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
            'ticket.TicketService', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))


 # This class is part of an EXPERIMENTAL API.
class TicketService(object):
    """Missing associated documentation comment in .proto file."""

    @staticmethod
    def BookTicket(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/ticket.TicketService/BookTicket',
            ticket__pb2.EventRequest.SerializeToString,
            ticket__pb2.Ticket.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def CancelTicket(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/ticket.TicketService/CancelTicket',
            ticket__pb2.TicketRequest.SerializeToString,
            ticket__pb2.TicketResponse.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def GetTicket(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_unary(request, target, '/ticket.TicketService/GetTicket',
            ticket__pb2.TicketRequest.SerializeToString,
            ticket__pb2.Ticket.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)

    @staticmethod
    def GetTickets(request,
            target,
            options=(),
            channel_credentials=None,
            call_credentials=None,
            insecure=False,
            compression=None,
            wait_for_ready=None,
            timeout=None,
            metadata=None):
        return grpc.experimental.unary_stream(request, target, '/ticket.TicketService/GetTickets',
            ticket__pb2.EventRequest.SerializeToString,
            ticket__pb2.Ticket.FromString,
            options, channel_credentials,
            insecure, call_credentials, compression, wait_for_ready, timeout, metadata)
