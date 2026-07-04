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
        UUID parentId = event.getBooking().getParent().getId();
        UUID tutorUserId = event.getBooking().getTutor().getUser().getId();
        String subject = event.getBooking().getSubject();
        String childName = event.getBooking().getChild().getName();

        switch (event.getEventType()) {
            case "CREATED" -> {
                notifyParent(parentId, "Booking Requested",
                        "Your booking request for " + childName + " (" + subject + ") has been sent.");
                notifyUser(tutorUserId, "New Booking Request",
                        "You have a new session request for " + subject + " from " + childName + ".");
            }
            case "ACCEPTED" -> {
                notifyParent(parentId, "Booking Accepted",
                        "Your booking for " + childName + " (" + subject + ") has been accepted! Please complete payment.");
            }
            case "REJECTED" -> {
                notifyParent(parentId, "Booking Rejected",
                        "Your booking for " + childName + " (" + subject + ") was rejected. Reason: "
                                + event.getBooking().getNotes());
            }
            case "CANCELLED" -> {
                notifyUser(tutorUserId, "Booking Cancelled",
                        "The booking for " + subject + " with " + childName + " has been cancelled.");
            }
            case "COMPLETED" -> {
                notifyParent(parentId, "Session Completed",
                        "The session for " + childName + " (" + subject + ") is complete. Leave a review!");
            }
        }
    }

    // ── Override methods ────────────────────────────────

    @Override
    public void sendBookingCreatedNotification(UUID parentId, UUID tutorUserId, String subject) {
        notifyParent(parentId, "Booking Requested", "Your booking for " + subject + " has been sent.");
        notifyUser(tutorUserId, "New Booking Request", "You have a new booking request for " + subject + ".");
    }

    @Override
    public void sendBookingAcceptedNotification(UUID parentId, String subject) {
        notifyParent(parentId, "Booking Accepted", "Your booking for " + subject + " has been accepted!");
    }

    @Override
    public void sendBookingRejectedNotification(UUID parentId, String subject, String reason) {
        notifyParent(parentId, "Booking Rejected",
                "Your booking for " + subject + " was rejected. Reason: " + reason);
    }

    @Override
    public void sendBookingCancelledNotification(UUID tutorUserId, String subject) {
        notifyUser(tutorUserId, "Booking Cancelled", "A booking for " + subject + " was cancelled.");
    }

    @Override
    public void sendBookingCompletedNotification(UUID parentId, String subject) {
        notifyParent(parentId, "Session Completed",
                "Your session for " + subject + " is complete. Leave a review!");
    }

    // ── Query methods ───────────────────────────────────

    public List<NotificationDTO> getUserNotifications(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream().map(NotificationDTO::new).toList();
    }

    public List<NotificationDTO> getUnreadNotifications(UUID userId) {
        return notificationRepository.findByUserIdAndIsRead(userId, false)
                .stream().map(NotificationDTO::new).toList();
    }

    public NotificationDTO markAsRead(UUID notificationId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        n.setRead(true);
        return new NotificationDTO(notificationRepository.save(n));
    }

    public void deleteNotification(UUID notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    // ── Helpers ─────────────────────────────────────────

    private void notifyParent(UUID parentId, String title, String message) {
        notifyUser(parentId, title, message);
    }

    private void notifyUser(UUID userId, String title, String message) {
        userRepository.findById(userId).ifPresent(user -> {
            notificationRepository.save(new Notification(user, "BOOKING", title, message));
            notificationSender.send(
                    user.getEmail(),
                    title + " - YalaDars",
                    "Hi " + user.getFirstName() + ",\n\n" + message + "\n\nYalaDars Team"
            );
        });
    }
}