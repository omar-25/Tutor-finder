package com.omar.yaladars.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class BookingDTO {

    private UUID id;
    private UUID childId;
    private String childName;
    private UUID parentId;
    private UUID tutorId;
    private String subject;
    private BookingStatus status;
    private LocalDateTime sessionTime;
    private BigDecimal totalAmount;
    private String notes;
    private LocalDateTime createdAt;

    public BookingDTO() {}

    public BookingDTO(Booking booking) {
        this.id = booking.getId();
        this.childId = booking.getChild().getId();
        this.childName = booking.getChild().getName();
        this.parentId = booking.getParent().getId();
        this.tutorId = booking.getTutor().getTutorId();
        this.subject = booking.getSubject();
        this.status = booking.getStatus();
        this.sessionTime = booking.getSessionTime();
        this.totalAmount = booking.getTotalAmount();
        this.notes = booking.getNotes();
        this.createdAt = booking.getCreatedAt();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getChildId() { return childId; }
    public void setChildId(UUID childId) { this.childId = childId; }

    public String getChildName() { return childName; }
    public void setChildName(String childName) { this.childName = childName; }

    public UUID getParentId() { return parentId; }
    public void setParentId(UUID parentId) { this.parentId = parentId; }

    public UUID getTutorId() { return tutorId; }
    public void setTutorId(UUID tutorId) { this.tutorId = tutorId; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public LocalDateTime getSessionTime() { return sessionTime; }
    public void setSessionTime(LocalDateTime sessionTime) { this.sessionTime = sessionTime; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}