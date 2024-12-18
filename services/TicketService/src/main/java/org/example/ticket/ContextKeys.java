package org.example.ticket;

import io.grpc.Context;

// Define a Context Keys for middleware
class ContextKeys {
    static final Context.Key<String> USER_ID_KEY = Context.key("x-kong-jwt-claim-user");
}