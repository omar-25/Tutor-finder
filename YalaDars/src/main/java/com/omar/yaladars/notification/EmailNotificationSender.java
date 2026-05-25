package com.omar.yaladars.notification;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailNotificationSender implements NotificationSender {

    private final JavaMailSender mailSender;

    public EmailNotificationSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void send(String recipient, String subject, String message) {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            mail.setTo(recipient);
            mail.setSubject(subject);
            mail.setText(message);
            mailSender.send(mail);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + recipient + ": " + e.getMessage());
        }
    }
}