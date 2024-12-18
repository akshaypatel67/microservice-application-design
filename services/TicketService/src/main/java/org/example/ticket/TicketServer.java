package org.example.ticket;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonDeserializer;
import io.grpc.Grpc;
import io.grpc.InsecureServerCredentials;
import io.grpc.Server;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.example.connections.TicketDatabase;
import org.example.kafka.KafkaConsumerImpl;
import org.example.kafka.MessageConsumer;
import org.example.utils.Utils;

import java.io.IOException;
import java.net.UnknownHostException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;
import java.util.logging.Logger;

public class TicketServer {
    private static final Logger logger = Logger.getLogger(TicketServer.class.getName());

    private Server server;

    private void start(int port) throws IOException {
        /* The port on which the server should run */
        server = Grpc.newServerBuilderForPort(port, InsecureServerCredentials.create())
                .addService(new TicketServiceImpl())
                .intercept(new TicketServerInterceptor())
                .build()
                .start();
        logger.info("Server started, listening on " + port);
        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                // Use stderr here since the logger may have been reset by its JVM shutdown hook.
                System.err.println("*** shutting down gRPC server since JVM is shutting down");
                try {
                    TicketServer.this.stop();
                } catch (InterruptedException e) {
                    e.printStackTrace(System.err);
                }
                System.err.println("*** server shut down");
            }
        });
    }

    private void stop() throws InterruptedException {
        if (server != null) {
            server.shutdown().awaitTermination(30, TimeUnit.SECONDS);
        }
    }

    /**
     * Await termination on the main thread since the grpc library uses daemon threads.
     */
    private void blockUntilShutdown() throws InterruptedException {
        if (server != null) {
            server.awaitTermination();
        }
    }

    /**
     * Main launches the server from the command line.
     */
    public static void main(String[] args) throws IOException, InterruptedException {
        try {
            startMessageConsumerForTicketStatus(Collections.singletonList("ticket-status-event"));
        } catch (SQLException e) {
            logger.warning("Not able to start the consumer.");
        }

        final TicketServer server = new TicketServer();
        server.start(50051);
        server.blockUntilShutdown();
    }

    private static void startMessageConsumerForTicketStatus(List<String> topics) throws SQLException {
        TicketDatabase database = TicketDatabase.getConnection();
        new MessageConsumer(topics, (record) -> {
            logger.info("Got message " + record.key() + " with value " + record.value());

            Map<String, String> ticketMessage = Utils.jsonDeserialize(record.value());
            String ticketId = ticketMessage.get("ticket_id");
            String status = ticketMessage.get("status");

            logger.info("consumer: " + ticketMessage.toString());

            try {
                switch (record.key()) {
                    case "booking":
                        if (status.equals("success")) {
                            logger.info("here---");
                            // updating the status of ticket to BOOKED.
                            database.updateTicket(ticketId, Ticket.StatusCode.BOOKED);
                        } else {
                            // updating the status of ticket to CANCELLED.
                            database.updateTicket(ticketId, Ticket.StatusCode.CANCELLED);
                        }
                        break;
                    case "cancellation":
                        if (!status.equals("success")) {
                            // updating the status of ticket to BOOKED.
                            database.updateTicket(ticketId, Ticket.StatusCode.BOOKED);
                        }
                        break;
                    default:
                }
            } catch (SQLException e) {
                throw new RuntimeException("Unable to update the record in database");
            }
        });
    }
}
