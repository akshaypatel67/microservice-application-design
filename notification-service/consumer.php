<?php

require './send_mail.php';

$conf = new \RdKafka\Conf();

$conf->set('bootstrap.servers', 'kafka:9092');
// $conf->set('sasl.mechanism', 'PLAIN');
$conf->set('group.id', 'notification-consumer-group');
// $conf->set('security.protocol', 'SASL_PLAINTEXT');
$conf->set('auto.offset.reset', 'earliest');

$consumer = new \RdKafka\KafkaConsumer($conf);

$consumer->subscribe(['ticket-success-event']);

while (true) {
    $message = $consumer->consume(5000);

    if (!is_null($message->payload)) {
        echo "Key is ", $message->key, " !", PHP_EOL;
        if ($message->key === "success") {
            $decoded = json_decode($message->payload);
            var_dump($message->payload);
            send_email($decoded->user_id);
        } else {
            echo "Failed to go in success queue", PHP_EOL;
        }

    // Uncomment if want to use thread.
    // 
    // if (!is_null($message->payload)) {
    //     (new class($message) extends Thread {
    //         private $message;

    //         public function __construct($message) {
    //             $this->message = $message;
    //         }

    //         public function run() {
    //             $message = $this->message;

    //             echo "Key is ", $message->key, " !", PHP_EOL;
    //             if ($message->key === "success") {
    //                 $decoded = json_decode($message->payload);
    //                 var_dump($message->payload);
    //                 send_email($decoded->user_id);
    //             } else {
    //                 echo "Failed to go in success queue", PHP_EOL;
    //             }
    //         }
    //     })->start();
    }
}
