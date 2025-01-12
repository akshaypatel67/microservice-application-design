# Use the official Python image
FROM python:3.8-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container at /app
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the current directory contents into the container at /app
COPY . /app

# Make port 50051 available to the world outside this container
EXPOSE 50051 8000

# Run analytics service when the container launches
CMD ["python", "-u", "./main.py", "&&", "gunicorn", "--bind", "0.0.0.0:8000", "server:app"]
