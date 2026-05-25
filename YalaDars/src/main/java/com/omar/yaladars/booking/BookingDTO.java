package com.omar.yaladars.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public class BookingDTO {

    private UUID id;
    private UUID studentId;
    private UUID tutorId;
    private String subject;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer duration;
    private BigDecimal totalAmount;
    private BookingStatus status;
    private String notes;
    private LocalDateTime createdAt;

    public BookingDTO() {}

    public BookingDTO(Booking booking) {
        this.id = booking.getId();
        this.studentId = booking.getStudent().getId();
        this.tutorId = booking.getTutor().getId();
        this.subject = booking.getSubject();
        this.startTime = booking.getStartTime();
        this.endTime = booking.getEndTime();
        this.duration = booking.getDuration();
        this.totalAmount = booking.getTotalAmount();
        this.status = booking.getStatus();
        this.notes = booking.getNotes();
        this.createdAt = booking.getCreatedAt();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getStudentId() { return studentId; }
    public void setStudentId(UUID studentId) { this.studentId = studentId; }

    public UUID getTutorId() { return tutorId; }
    public void setTutorId(UUID tutorId) { this.tutorId = tutorId; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}