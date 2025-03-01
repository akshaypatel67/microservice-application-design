# Event Management and Ticket Booking Platform

Welcome to the **Event Management and Ticket Booking Platform**! This project is a robust implementation of microservices concepts and serves as a learning and practical exercise in building scalable, reliable, and maintainable systems.

---

## Table of Contents
- [Introduction](#introduction)
- [Technologies and Tools](#technologies-and-tools)
- [Microservices Architecture](#microservices-architecture)
- [Key Microservices Concepts](#key-microservices-concepts)
- [Services Overview](#services-overview)
- [Configurations and Deployment](#configurations-and-deployment)
- [Scalability, Reliability, and Consistency](#scalability-reliability-and-consistency)

---

## Introduction
This platform enables users to register, book tickets, manage events, and provide feedback. Each functionality is handled by independent services communicating via both synchronous (REST/gRPC) and asynchronous (Kafka) methods. The system ensures reliability, scalability, and eventual consistency while showcasing advanced microservices patterns.

---

## Technologies and Tools

### Backend Technologies
- **Node.js** (User, Event, Notification Services)
- **Java** (Ticket Service)
- **Golang** (Feedback Service)
- **Python (Flask)** (Analytics Service)

### Databases
- **MongoDB** (User, Event Services)
- **MySQL** (Ticket Service)
- **CockroachDB** (Feedback Service)
- **PostgreSQL** (Analytics Service)

### Messaging and API Gateway
- **Kafka** (Messaging Broker)
- **Kong Gateway**
  - REST to gRPC conversion
  - JWT Authentication
  - Custom Plugins (JWT2HEADER, Error Handling)

### Other Tools
- **Docker** (Containerization)
- **Docker Compose** (Deployment)
- **Kubernetes** (Deployment, Scalling, Orchestration)
- **EmailJS** (Email Notifications)

---

## Microservices Architecture

The project adheres to key microservices principles:
- **Independent Deployment:** Each service is containerized and deployed separately.
- **Database per Service:** Each service has its own database, ensuring data autonomy.
- **Service Discovery:** Managed via Kong Gateway.
- **Communication:**
  - **Synchronous:** REST and gRPC for real-time requests.
  - **Asynchronous:** Kafka for event-driven messaging.
- **Scalability:** Horizontal scaling enabled by containerization.
- **Fault Isolation:** Issues in one service do not propagate to others.

![microservice bg-white drawio](https://github.com/akshaypatel67/microservice-application-design/assets/66596874/368e7d8f-f18d-4469-965f-733cebf99d28)

---

## Key Microservices Concepts

### API Gateway
- **Kong Gateway** handles:
  - REST to gRPC conversion using proto files.
  - JWT-based authentication with custom plugins for enhanced functionality.

### Messaging
- **Kafka** ensures eventual consistency and reliable communication:
  - Topics include `ticket-event`, `ticket-status-event`, `visit-event`, `upsert-data`, and `feedback-event`.

### SAGA Pattern
- **Choreography-based Saga**:
  - Ticket Service initiates booking/cancellation.
  - Event Service adjusts seat availability.
  - Feedback and Notification Services respond based on ticket status.

---

## Services Overview

### 1. User Service
- **Functionality:** User registration, authentication, and profile management.
- **Communication:**
  - Publishes changes to `upsert-data` topic.
  - Uses JWT for authentication.
- **Technology:** Node.js, MongoDB

### 2. Event Service
- **Functionality:** Event creation, seat management.
- **Communication:**
  - Listens to `ticket-event` for booking/cancellation.
  - Publishes to `ticket-status-event` and `upsert-data`.
- **Technology:** Node.js, MongoDB

### 3. Ticket Service
- **Functionality:** Ticket creation and transaction management.
- **Communication:**
  - Initiates messages to `ticket-event`.
  - Listens to `ticket-status-event` for Saga completion.
- **Technology:** Java, MySQL

### 4. Feedback Service
- **Functionality:** Event feedback recording.
- **Communication:** Publishes to `feedback-event`.
- **Technology:** Golang, CockroachDB

### 5. Notification Service
- **Functionality:** Sends booking/cancellation confirmations.
- **Communication:** Listens to `ticket-status-event`.
- **Technology:** Node.js

### 6. Analytics Service
- **Functionality:** Generates analytics and reports.
- **Communication:** Listens to all topics for comprehensive data.
- **Technology:** Python-Flask, PostgreSQL

---

## Configurations and Deployment

1. **Kong Gateway:**
   - Routes and plugins configured via Kong Admin APIs.
   - Custom plugins:
     - **JWT2HEADER:** Extracts JWT claims to headers.
     - **Error Handling:** Maps gRPC errors to appropriate HTTP status codes.

2. **Kafka Setup:**
   - Topics created for event-driven messaging.
   - Zookeeper for Kafka coordination.

3. **Docker Compose:**
   - **Service Orchestration:** All services, databases, Kafka, and Zookeeper are orchestrated using Docker Compose.
   - **Volume Management:** Persistent storage is enabled for Zookeeper and Kafka logs.
   - **Health Checks:** Defined for Kong to ensure availability.

---

## Kubernetes Deployment

The project now supports **Kubernetes** for container orchestration, ensuring scalability and high availability.

### Deployment Steps

1.  **Ensure Kubernetes Cluster is Set Up**
    
    -   Use Minikube for local testing or deploy on a managed Kubernetes service (EKS, AKS, GKE).
2.  **Apply Configurations**
    
    ```sh
    kubectl apply -f kubernetes/configs/
    kubectl apply -f kubernetes/deployments/
    kubectl apply -f kubernetes/services/
    kubectl apply -f kubernetes/jobs/
    kubectl apply -f kubernetes/volumes/
    
    ```
    
3.  **Verify Deployments**
    
    ```sh
    kubectl get pods
    kubectl get services
    kubectl get jobs
    kubectl get pvc
    
    ```
    

### Kubernetes Components

-   **ConfigMaps:** Kong configuration files (`configs/kong-cm0-configmap.yaml`, etc.)
-   **Deployments:** Each service has its own deployment YAML file (`kubernetes/deployments/`).
-   **Services:** Exposes applications via Kubernetes Services.
-   **Jobs:** One-time or batch processing jobs (`kubernetes/jobs/`).
-   **Volumes:** Persistent storage for databases and services (`kubernetes/volumes/`).

---

## Scalability, Reliability, and Consistency

### Scalability
- Horizontal scaling supported via Docker.
- Independent scaling of services based on load.

### Reliability
- Kafka ensures at-least-once message delivery.
- SAGA pattern ensures consistent distributed transactions.

### Consistency
- Eventual consistency achieved through asynchronous messaging.
- Each service handles its own database updates and publishes events for others to synchronize.

---

## Future Enhancements

- **Monitoring & Logging Integration:** Integrate Prometheus and Grafana for advanced monitoring and logging capabilities.
- **Kubernetes Orchestration:** Transition to Kubernetes for service orchestration, utilizing pods and clusters for enhanced scalability.
- **CQRS and Event Sourcing:** Implement CQRS and Event Sourcing patterns using Kafka and Debezium for more robust data handling.
- **Circuit Breaker:** Introduce circuit breaker patterns to improve fault tolerance and prevent cascading failures.

---

## Conclusion
This project showcases a highly modular, scalable, and reliable microservices architecture. By integrating various microservices patterns and tools, it demonstrates best practices for real-world applications. Dive into the code to explore and enhance the platform!
