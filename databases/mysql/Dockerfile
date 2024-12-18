# Use the official MySQL base image
FROM mysql:latest

# Environment variables for MySQL
ENV MYSQL_ROOT_PASSWORD=admin
ENV MYSQL_DATABASE=Ticket

# Copy the SQL script to initialize the database
COPY ticketing.sql /docker-entrypoint-initdb.d/

# Expose the MySQL port
EXPOSE 3306