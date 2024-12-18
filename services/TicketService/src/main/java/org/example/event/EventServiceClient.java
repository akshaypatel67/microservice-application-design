package org.example.event;

import io.grpc.*;

import java.util.logging.Logger;

public class EventServiceClient {
    private static final Logger logger = Logger.getLogger(EventServiceClient.class.getName());

    private final EventServiceGrpc.EventServiceBlockingStub blockingStub;

    private static EventServiceClient eventServiceClient;


    private EventServiceClient() {
        String target = "event-service:50051";

        ManagedChannel channel = Grpc.newChannelBuilder(target, InsecureChannelCredentials.create())
                .build();
        blockingStub = EventServiceGrpc.newBlockingStub(channel);
    }

    public static EventServiceClient getClient() {
        if (eventServiceClient == null) {
            eventServiceClient = new EventServiceClient();
        }

        return eventServiceClient;
    }

    public Event getEvent(String eventId) throws StatusRuntimeException {
        EventId eventRequest = EventId.newBuilder()
                .setId(eventId)
                .build();

        Event eventResponse = blockingStub.getEvent(eventRequest);

        return eventResponse;
    }

    //            // ManagedChannels use resources like threads and TCP connections. To prevent leaking these
    //            // resources the channel should be shut down when it will no longer be used. If it may be used
    //            // again leave it running.
    //            channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
}
