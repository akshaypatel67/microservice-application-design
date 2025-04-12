# Use the official OpenJDK base image
FROM openjdk:11

# Set the working directory in the container
WORKDIR /app

# Copy the entire project directory into the container
COPY . /app

# Expose the port your application runs on
EXPOSE 50051

# Command to run your application
CMD ["./gradlew", "run", "--no-daemon"]