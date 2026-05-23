package com.omar.yaladars.tutor;

import jakarta.persistence.*;
import java.time.LocalTime;
import java.util.UUID;

@Entity
public class Availability {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID availabilityId;

    private LocalTime startTime;
    private LocalTime endTime;
    private String dayOfTheWeek;
    private String subject;

    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private Tutor tutor;

    public Availability() {}

    public UUID getAvailabilityId() { return availabilityId; }
    public void setAvailabilityId(UUID id) { this.availabilityId = id; }
    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public String getDayOfTheWeek() { return dayOfTheWeek; }
    public void setDayOfTheWeek(String day) { this.dayOfTheWeek = day; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
    public Tutor getTutor() { return tutor; }
    public void setTutor(Tutor tutor) { this.tutor = tutor; }
}