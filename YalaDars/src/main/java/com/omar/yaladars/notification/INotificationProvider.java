package com.omar.yaladars.notification;

import java.util.UUID;

public interface INotificationProvider {

    void sendBookingCreatedNotification(UUID studentId, UUID tutorId, String subject);
    void sendBookingAcceptedNotification(UUID studentId, String subject);
    void sendBookingRejectedNotification(UUID studentId, String subject, String reason);
    void sendBookingCancelledNotification(UUID tutorId, String subject);
    void sendBookingCompletedNotification(UUID studentId, String subject);
}