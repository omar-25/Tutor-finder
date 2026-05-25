package com.omar.yaladars.notification;

public interface NotificationSender {
    void send(String recipient, String subject, String message);
}