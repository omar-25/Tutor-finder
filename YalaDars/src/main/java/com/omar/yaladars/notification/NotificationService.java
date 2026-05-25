package com.omar.yaladars.notification;

import com.omar.yaladars.UserManagement.User;
import com.omar.yaladars.UserManagement.UserRepository;
import com.omar.yaladars.booking.BookingEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class NotificationService implements INotificationProvider {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationSender notificationSender;

    public NotificationService(NotificationRepository notificationRepository,
                               UserRepository userRepository,
                               NotificationSender notificationSender) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
        this.notificationSender = notificationSender;
    }

    @EventListener
    public void handleBookingEvent(BookingEvent event) {
        switch (event.getEventType()) {
            case "CREATED" -> sendBookingCreatedNotification(
                    event.getBooking().getStudent().getId(),
                    event.getBooking().getTutor().getId(),
                    event.getBooking().getSubject()
            );
            case "ACCEPTED" -> sendBookingAcceptedNotification(
                    event.getBooking().getStudent().getId(),
                    event.getBooking().getSubject()
            );
            case "REJECTED" -> sendBookingRejectedNotification(
                    event.getBooking().getStudent().getId(),
                    event.getBooking().getSubject(),
                    event.getBooking().getNotes()
            );
            case "CANCELLED" -> sendBookingCancelledNotification(
                    event.getBooking().getTutor().getId(),
                    event.getBooking().getSubject()
            );
            case "COMPLETED" -> sendBookingCompletedNotification(
                    event.getBooking().getStudent().getId(),
                    event.getBooking().getSubject()
            );
        }
    }

    @Override
    public void sendBookingCreatedNotification(UUID studentId, UUID tutorId, String subject) {
        User student = userRepository.findById(studentId).orElse(null);
        User tutor = userRepository.findById(tutorId).orElse(null);

        if (student != null) {
            save(student, "BOOKING", "Booking Requested",
                    "Your booking request for " + subject + " has been sent.");
            notificationSender.send(
                    student.getEmail(),
                    "Booking Requested - YalaDars",
                    "Hi " + student.getFirstName() + ",\n\nYour booking request for " + subject + " has been sent successfully.\n\nYalaDars Team"
            );
        }
        if (tutor != null) {
            save(tutor, "BOOKING", "New Booking Request",
                    "You have a new booking request for " + subject + ".");
            notificationSender.send(
                    tutor.getEmail(),
                    "New Booking Request - YalaDars",
                    "Hi " + tutor.getFirstName() + ",\n\nYou have a new booking request for " + subject + ".\n\nLogin to accept or reject it.\n\nYalaDars Team"
            );
        }
    }

    @Override
    public void sendBookingAcceptedNotification(UUID studentId, String subject) {
        userRepository.findById(studentId).ifPresent(student -> {
            save(student, "BOOKING", "Booking Accepted",
                    "Your booking for " + subject + " has been accepted!");
            notificationSender.send(
                    student.getEmail(),
                    "Booking Accepted - YalaDars",
                    "Hi " + student.getFirstName() + ",\n\nGreat news! Your booking for " + subject + " has been accepted.\n\nYalaDars Team"
            );
        });
    }

    @Override
    public void sendBookingRejectedNotification(UUID studentId, String subject, String reason) {
        userRepository.findById(studentId).ifPresent(student -> {
            save(student, "BOOKING", "Booking Rejected",
                    "Your booking for " + subject + " was rejected. Reason: " + reason);
            notificationSender.send(
                    student.getEmail(),
                    "Booking Rejected - YalaDars",
                    "Hi " + student.getFirstName() + ",\n\nYour booking for " + subject + " was rejected.\nReason: " + reason + "\n\nYalaDars Team"
            );
        });
    }

    @Override
    public void sendBookingCancelledNotification(UUID tutorId, String subject) {
        userRepository.findById(tutorId).ifPresent(tutor -> {
            save(tutor, "BOOKING", "Booking Cancelled",
                    "A booking for " + subject + " has been cancelled.");
            notificationSender.send(
                    tutor.getEmail(),
                    "Booking Cancelled - YalaDars",
                    "Hi " + tutor.getFirstName() + ",\n\nA booking for " + subject + " has been cancelled.\n\nYalaDars Team"
            );
        });
    }

    @Override
    public void sendBookingCompletedNotification(UUID studentId, String subject) {
        userRepository.findById(studentId).ifPresent(student -> {
            save(student, "BOOKING", "Session Completed",
                    "Your session for " + subject + " is complete. Leave a review!");
            notificationSender.send(
                    student.getEmail(),
                    "Session Completed - YalaDars",
                    "Hi " + student.getFirstName() + ",\n\nYour session for " + subject + " is complete. Don't forget to leave a review!\n\nYalaDars Team"
            );
        });
    }

    public List<NotificationDTO> getUserNotifications(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(NotificationDTO::new).toList();
    }

    public List<NotificationDTO> getUnreadNotifications(UUID userId) {
        return notificationRepository.findByUserIdAndIsRead(userId, false)
                .stream().map(NotificationDTO::new).toList();
    }

    public NotificationDTO markAsRead(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        return new NotificationDTO(notificationRepository.save(notification));
    }

    public void deleteNotification(UUID notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    private void save(User user, String type, String title, String message) {
        notificationRepository.save(new Notification(user, type, title, message));
    }
}