package org.example.kafka;

import org.apache.kafka.clients.consumer.ConsumerRecord;

import java.net.UnknownHostException;
import java.util.List;
import java.util.function.Consumer;
import java.util.logging.Logger;

public class MessageConsumer {
    private static final Logger logger = Logger.getLogger(KafkaProducerImpl.class.getName());

    public MessageConsumer(List<String> topics, Consumer<ConsumerRecord<String, String>> consumerRecord) {
        try {
            Thread consumerThread = new Thread(new KafkaConsumerImpl(topics, consumerRecord));
            consumerThread.start();
        } catch (UnknownHostException e) {
            logger.warning("Unable to start the consumer.");
        }
    }
}
