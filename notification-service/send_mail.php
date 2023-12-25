<?php
    set_include_path('../PHPMailer/');

    // Start with PHPMailer class
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;

    require '../PHPMailer/src/Exception.php';
    require '../PHPMailer/src/PHPMailer.php';
    require '../PHPMailer/src/SMTP.php';

    function send_email($recipient) {
        $user = getenv('EMAIL_USER');
        $pass = getenv('EMAIL_PASS');
        $host = getenv('EMAIL_HOST');
        $port = getenv('EMAIL_PORT');

        $mail = new PHPMailer(true);
        // configure an SMTP
        $mail->isSMTP();
        $mail->Host = $host;
        $mail->SMTPAuth = true;
        $mail->Username = $user;
        $mail->Password = $pass;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = $port;

        $mail->setFrom("$user", 'PrasangConnect');
        $mail->addAddress("$recipient", 'Me');
        $mail->Subject = 'Ticket booked successfully!!!';
        // Set HTML 
        $mail->isHTML(TRUE);
        $mail->Body = '<html>Hi there, we are happy to <br>confirm your booking.';
        $mail->AltBody = 'Hi there, we are happy to confirm your booking.';
        // add attachment 
        // just add the '/path/to/file.pdf'
        // $attachmentPath = './confirmations/yourbooking.pdf';
        // if (file_exists($attachmentPath)) {
        //     $mail->addAttachment($attachmentPath, 'yourbooking.pdf');
        // }

        // send the message
        if(!$mail->send()){
            echo 'Message could not be sent.';
            echo 'Mailer Error: ' . $mail->ErrorInfo;
        } else {
            echo 'Message has been sent';
        }
    }
?>