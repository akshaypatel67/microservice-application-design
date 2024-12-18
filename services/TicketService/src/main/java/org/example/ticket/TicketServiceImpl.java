package org.example.ticket;

import com.google.protobuf.Message;
import io.grpc.Status;
import io.grpc.StatusRuntimeException;
import io.grpc.binarylog.v1.Metadata;
import io.grpc.stub.StreamObserver;

import org.example.connections.TicketDatabase;
import org.example.ticket.Ticket;
import org.example.event.Event;
import org.example.event.EventServiceClient;
import org.example.kafka.KafkaProducerImpl;
import org.example.utils.Utils;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

final class TicketServiceImpl extends TicketServiceGrpc.TicketServiceImplBase {
    private final static Logger logger = Logger.getLogger(TicketServiceImpl.class.getName());
    private final TicketDatabase database;

    private final KafkaProducerImpl messageProducer;
    private final EventServiceClient eventServiceClient;

    TicketServiceImpl() throws IOException {
        try {
            database = TicketDatabase.getConnection();
            messageProducer = KafkaProducerImpl.getKafkaProducer();
            eventServiceClient = EventServiceClient.getClient();
        } catch (SQLException e) {
            logger.warning("Unable to connect to database " + e.getMessage());
            throw new IOException("Unable to connect to database for read and write");
        }
    }

    @Override
    public void bookTicket(EventRequest request, StreamObserver<Ticket> responseObserver) {

        // Creating a ticket and storing it into the database.
        try {
            // Check if event is valid with available seats.
            // GRPC call to Event service.
            Event event = eventServiceClient.getEvent(request.getEventId());
            String userId = ContextKeys.USER_ID_KEY.get();
            Ticket ticket;

            logger.info(String.valueOf(event.getDate()));
            logger.info(String.valueOf((new Date()).getTime()));

            if (event.getBooked() >= event.getTotal()) {
                // || event.getDate() <= (new Date()).getTime()) {
                throw new Exception("Event is already full.");
            }

            List<Ticket> existingTickets = database.getTickets(userId, request.getEventId());

            logger.info("size: " + String.valueOf(existingTickets.size()));

            if (existingTickets.size() > 0) {
                ticket = existingTickets.get(0);

                logger.info(String.valueOf(ticket.getStatusValue()));

                if (ticket.getStatusValue() == 1) {
                    throw new SQLException();
                }

                database.updateTicket(ticket.getTicketId(), Ticket.StatusCode.PENDING);
            } else {
                ticket = database.createTicket(userId, request.getEventId());
            }

            responseObserver.onNext(ticket);
            logger.info(ticket.toString());

            // Push changes to kafka channel.
            Map<String, String> values = new HashMap<>();
            values.put("ticket_id", ticket.getTicketId());
            values.put("event_id", ticket.getEventId());
            values.put("user_id", userId);

            messageProducer.createTicketGeneratedMessage("ticket-event", "booked", Utils.jsonSerialization(values));
            responseObserver.onCompleted();
        } catch (SQLException e) {
            logger.warning("Unable to store the ticket into database");
            responseObserver.onError(Status.INTERNAL.asRuntimeException());
        } catch (StatusRuntimeException e) {
            logger.warning("Failed to fetch the event data from Event service. Please ensure is the event service is up.");
            responseObserver.onError(Status.NOT_FOUND.asRuntimeException());
        } catch (Exception e) {
            logger.warning("Trying to book an already full event with id {" + request.getEventId() + "}");
            responseObserver.onError(Status.CANCELLED.asRuntimeException());
        }
    }

    @Override
    public void cancelTicket(TicketRequest request, StreamObserver<TicketResponse> responseObserver) {

        // Cancelling the ticket information from the database.
        boolean ticketCancelled = false;
        Ticket ticket = null;
        try {
            String userId = ContextKeys.USER_ID_KEY.get();

            ticket = database.getTicket(request.getTicketId());

            if (!ticket.getUserId().equals(userId)) {
                throw new Exception("User not authorized");
            }

            // Check if event is valid with complete date and time
            // is greater than current date and time.
            Event event = eventServiceClient.getEvent(ticket.getEventId());
            if (ticket.getStatus() == Ticket.StatusCode.INVALID) {
            // || event.getDate() <= (new Date()).getTime()) {
                database.deleteTicket(ticket.getTicketId());
                logger.warning("A try to delete a expired ticket made.");
                responseObserver.onError(Status.ABORTED.asRuntimeException());
                return;
            }

            ticketCancelled = database.updateTicket(request.getTicketId(), Ticket.StatusCode.CANCELLED);
            logger.info("cancelled ticket!!!!!");
        } catch (SQLException e) {
            logger.warning("Failed to cancel the ticket with id {" + request.getTicketId() + "}");
        } catch (Exception e) {
            logger.warning("Trying to cancel an invalid or unauthorized ticket with id {" + request.getTicketId() + "}");
            responseObserver.onError(Status.CANCELLED.asRuntimeException());
        }

        TicketResponse response = TicketResponse.newBuilder()
                .setMessage((ticketCancelled) ? "ticket cancelled successfully!" : "failed to cancel ticket!")    // Success: Kafka message push succeed
                .build();

        if (ticketCancelled) {
            // Push event into kafka channel to notify the user.
            // Notification service will take the response and notify user if ticket
            // was cancelled successfully.

            Map<String, String> values = new HashMap<>();
            values.put("ticket_id", ticket.getTicketId());
            values.put("event_id", ticket.getEventId());
            values.put("user_id", ticket.getUserId());

            messageProducer.createTicketGeneratedMessage("ticket-event", "cancelled", Utils.jsonSerialization(values));
        }

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void getTicket(TicketRequest request, StreamObserver<Ticket> responseObserver) {

        // Get a ticket information based on ticket_id.
        try {
            String userId = ContextKeys.USER_ID_KEY.get();
            userId = userId != "internal" ? userId : request.getUserId();
            Ticket ticket = database.getTicket(request.getTicketId());

            logger.info(ticket.getUserId() + ", " + userId);

            if (!ticket.getUserId().equals(userId)) {
                logger.warning("User not authorized");
                throw new Exception("User not authorized");
            }

            responseObserver.onNext(ticket);
            responseObserver.onCompleted();
        } catch (SQLException e) {
            logger.warning("No ticket with the specified ticket_id {" + request.getTicketId() + "} found.");
            responseObserver.onError(Status.NOT_FOUND.asRuntimeException());
            return;
        } catch (Exception e) {
            logger.warning("Trying to get an invalid or unauthorized ticket with id {" + request.getTicketId() + "}");
            responseObserver.onError(Status.CANCELLED.asRuntimeException());
        }
    }

    @Override
    public void getTickets(EventRequest request, StreamObserver<Ticket> responseObserver) {

        // Get all tickets form the database based on user_id and event_id.
        try {
            String userId = ContextKeys.USER_ID_KEY.get();
            List<Ticket> tickets = (!request.getEventId().isEmpty())
                    ? database.getTickets(userId, request.getEventId())
                    : database.getTickets(userId);

            for (Ticket data: tickets) {
                if (data == null) {
                    continue;
                }

                responseObserver.onNext(data);
            }
        } catch (SQLException e) {
            logger.warning("Failed to get the tickets.");
            responseObserver.onError(Status.INTERNAL.asRuntimeException());
            return;
        }

        responseObserver.onCompleted();
    }
}
