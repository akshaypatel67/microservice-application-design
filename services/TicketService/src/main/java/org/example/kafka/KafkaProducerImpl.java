package org.example.kafka;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.*;
import java.util.logging.Logger;

public class KafkaProducerImpl {
    private static final Logger logger = Logger.getLogger(KafkaProducerImpl.class.getName());
    private final KafkaProducer<String, String> producer;

    private static KafkaProducerImpl kafkaProducerImpl;

    private KafkaProducerImpl() throws UnknownHostException {
        Properties config = new Properties();
        config.put("client.id", InetAddress.getLocalHost().getHostName());
        config.put("bootstrap.servers", "kafka-cluster.default.svc.cluster.local:9092");
        config.put("acks", "all");
        config.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        config.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        config.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        config.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        producer = new KafkaProducer<>(config);
    }

    public static KafkaProducerImpl getKafkaProducer() throws UnknownHostException {
        if (kafkaProducerImpl == null) {
            kafkaProducerImpl = new KafkaProducerImpl();
        }

        return kafkaProducerImpl;
    }

    public void createTicketGeneratedMessage(String topic, String key, String value) {
        producer.send(
                new ProducerRecord<>(topic, key, value),
                (event, exception) -> {
                    if (exception != null) {
                        exception.printStackTrace();
                    } else {

                    }
                }
        );
    }

    public void closeConnection() {
        producer.close();
    }
}
