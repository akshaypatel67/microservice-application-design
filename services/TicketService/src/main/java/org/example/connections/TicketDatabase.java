package org.example.connections;

import org.example.ticket.Ticket;
import org.example.ticket.TicketServer;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class TicketDatabase {
    private static final Logger logger = Logger.getLogger(TicketDatabase.class.getName());

    private final String CONNECTION_URL = "jdbc:mysql://"
            + System.getenv("MYSQL_HOST") + ":"
            + System.getenv("MYSQL_PORT") + "/Ticket";

    private final Connection conn;

    private static TicketDatabase ticketDatabase;

    private TicketDatabase() throws SQLException {
        String username = System.getenv("DB_USER");
        String password = System.getenv("DB_PASSWORD");
        conn = DriverManager.getConnection(CONNECTION_URL, username, password);
    }

    public static synchronized TicketDatabase getConnection() throws SQLException {
        if (ticketDatabase == null) {
            ticketDatabase = new TicketDatabase();
        }
        return ticketDatabase;
    }

    public Ticket createTicket(String userId, String eventId) throws SQLException {
        Ticket.StatusCode status = Ticket.StatusCode.PENDING;

        CallableStatement bookTicketCall = conn.prepareCall("{CALL BookTicket(?, ?, ?)}");

        bookTicketCall.setString(1, userId);
        bookTicketCall.setString(2, eventId);
        bookTicketCall.setInt(3, status.getNumber());

        boolean isSuccessfulWithResults = bookTicketCall.execute();

        if (isSuccessfulWithResults) {
            ResultSet ticketResultSet = bookTicketCall.getResultSet();
            ticketResultSet.next();

            Ticket ticket = Ticket.newBuilder()
                    .setTicketId(ticketResultSet.getString("ticket_id"))
                    .setEventId(ticketResultSet.getString("event_id"))
                    .setUserId(ticketResultSet.getString("user_id"))
                    .setDatePurchased((ticketResultSet.getTimestamp("date_purchased")).getTime())
                    .setStatusValue(ticketResultSet.getInt("status_code"))
                    .build();

            return ticket;
        } else {
            throw new SQLException("Failed to store ticket into the database.");
        }
    }

    public boolean deleteTicket(String ticketId) throws SQLException {
        CallableStatement bookTicketCall = conn.prepareCall("{CALL CancelTicket(?)}");
        bookTicketCall.setString(1, ticketId);

        int rowsAffected = bookTicketCall.executeUpdate();

        return rowsAffected > 0;
    }

    public Ticket getTicket(String ticketId) throws SQLException {
        CallableStatement bookTicketCall = conn.prepareCall("{CALL GetTicket(?)}");

        bookTicketCall.setString(1, ticketId);

        boolean isSuccessfulWithResults = bookTicketCall.execute();

        if (isSuccessfulWithResults) {
            ResultSet ticketResultSet = bookTicketCall.getResultSet();
            ticketResultSet.next();

            Ticket ticket = Ticket.newBuilder()
                    .setTicketId(ticketResultSet.getString("ticket_id"))
                    .setEventId(ticketResultSet.getString("event_id"))
                    .setUserId(ticketResultSet.getString("user_id"))
                    .setDatePurchased((ticketResultSet.getTimestamp("date_purchased")).getTime())
                    .setStatusValue(ticketResultSet.getInt("status_code"))
                    .build();

            return ticket;
        } else {
            throw new SQLException("No ticket associated with the given ticketId.");
        }
    }

    public boolean updateTicket(String ticketId, Ticket.StatusCode status) throws SQLException {
        System.out.println("update: " + ticketId + ":" + String.valueOf(status.getNumber()));
        CallableStatement bookTicketCall = conn.prepareCall("{CALL UpdateTicketStatus(?, ?)}");
        bookTicketCall.setString(1, ticketId);
        bookTicketCall.setInt(2, status.getNumber());

        int rowsAffected = bookTicketCall.executeUpdate();

        return rowsAffected > 0;
    }

    public List<Ticket> getTickets(String userId) throws SQLException {
        List<Ticket> tickets = new ArrayList<>();
        CallableStatement bookTicketCall = conn.prepareCall("{CALL GetUserTickets(?)}");

        bookTicketCall.setString(1, userId);

        boolean isSuccessfulWithResults = bookTicketCall.execute();
        ResultSet ticketResultSet = bookTicketCall.getResultSet();

        while (ticketResultSet != null && ticketResultSet.next()) {
            Ticket ticket = Ticket.newBuilder()
                    .setTicketId(ticketResultSet.getString("ticket_id"))
                    .setEventId(ticketResultSet.getString("event_id"))
                    .setUserId(ticketResultSet.getString("user_id"))
                    .setDatePurchased((ticketResultSet.getTimestamp("date_purchased")).getTime())
                    .setStatusValue(ticketResultSet.getInt("status_code"))
                    .build();

            tickets.add(ticket);
        }

        return tickets;
    }

    public List<Ticket> getTickets(String userId, String eventId) throws SQLException {
        List<Ticket> tickets = new ArrayList<>();
        CallableStatement bookTicketCall = conn.prepareCall("{CALL GetEventTickets(?, ?)}");

        bookTicketCall.setString(1, userId);
        bookTicketCall.setString(2, eventId);

        boolean isSuccessfulWithResults = bookTicketCall.execute();
        ResultSet ticketResultSet = bookTicketCall.getResultSet();

        while (ticketResultSet != null && ticketResultSet.next()) {
            Ticket ticket = Ticket.newBuilder()
                    .setTicketId(ticketResultSet.getString("ticket_id"))
                    .setEventId(ticketResultSet.getString("event_id"))
                    .setUserId(ticketResultSet.getString("user_id"))
                    .setDatePurchased((ticketResultSet.getTimestamp("date_purchased")).getTime())
                    .setStatusValue(ticketResultSet.getInt("status_code"))
                    .build();

            tickets.add(ticket);
        }

        return tickets;
    }
}
