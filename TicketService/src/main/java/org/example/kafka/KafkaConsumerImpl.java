package org.example.kafka;

import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.Duration;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.function.Consumer;
import java.util.function.Function;
import java.util.logging.Logger;

public class KafkaConsumerImpl implements Runnable {
    private static final Logger logger = Logger.getLogger(KafkaProducerImpl.class.getName());
    private final KafkaConsumer<String, String> consumer;
    private final List<String> topics;
    private final AtomicBoolean shutdown;
    private final CountDownLatch shutdownLatch;
    private final Consumer<ConsumerRecord<String, String>> process;

    public KafkaConsumerImpl(List<String> topics,
                             Consumer<ConsumerRecord<String, String>> process) throws UnknownHostException {
        Properties config = new Properties();
        config.put("client.id", InetAddress.getLocalHost().getHostName());
        config.put("bootstrap.servers", "kafka:9092");
        config.put("acks", "all");
        config.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        config.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer");
        config.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        config.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        config.put(ConsumerConfig.GROUP_ID_CONFIG, "ticket-consumer-group");
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        consumer = new KafkaConsumer<>(config);
        this.topics = topics;
        this.shutdown = new AtomicBoolean(false);
        this.shutdownLatch = new CountDownLatch(1);
        this.process = process;

        logger.info("Starting kafka consumer...");
    }

    @Override
    public void run() {
        try {
            consumer.subscribe(topics);

            while (true) {
                ConsumerRecords<String, String> records = consumer.poll(Duration.ofMillis(500));
                try {
                    records.forEach(process);
                    consumer.commitAsync();
                } catch (RuntimeException e) {
                    logger.warning("Failed to fetch message from kafka channel.");
                }
            }
        } finally {
            consumer.close();
            shutdownLatch.countDown();
            while (true) {
                try {
                    shutdown();
                    break;
                } catch (InterruptedException e) {
                    logger.warning("Unable to shutdown consumer. Trying again...");
                }
            }
        }
    }

    public void shutdown() throws InterruptedException {
        logger.info("Shutting down kafka consumer...");
        shutdown.set(true);
        shutdownLatch.await();
    }
}
