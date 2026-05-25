package com.omar.yaladars.notification;

import java.time.LocalDateTime;
import java.util.UUID;

public class NotificationDTO {

    private UUID id;
    private UUID userId;
    private String type;
    private String title;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;

    public NotificationDTO() {}

    public NotificationDTO(Notification notification) {
        this.id = notification.getId();
        this.userId = notification.getUser().getId();
        this.type = notification.getType();
        this.title = notification.getTitle();
        this.message = notification.getMessage();
        this.isRead = notification.isRead();
        this.createdAt = notification.getCreatedAt();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}