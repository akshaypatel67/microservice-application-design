package org.example.ticket;

import io.grpc.*;
import io.grpc.Metadata;

public class TicketServerInterceptor implements ServerInterceptor {
    @Override
    public <ReqT, RespT> ServerCall.Listener<ReqT> interceptCall(
            ServerCall<ReqT, RespT> call, 
            Metadata headers, 
            ServerCallHandler<ReqT, RespT> next) {
        String authHeader = headers.get(Metadata.Key.of("Authorization", Metadata.ASCII_STRING_MARSHALLER));
        String userId = headers.get(Metadata.Key.of("x-kong-jwt-claim-user", Metadata.ASCII_STRING_MARSHALLER));

        Context context;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring("Bearer ".length());
            // Handle the token as needed
            System.out.println("Token: " + token);

            context = Context.current().withValue(ContextKeys.USER_ID_KEY, userId);
        } else {
            context = Context.current().withValue(ContextKeys.USER_ID_KEY, "internal");
        }
        System.out.println("User: " + userId);


        return Contexts.interceptCall(context, call, headers, next);
    }
}
