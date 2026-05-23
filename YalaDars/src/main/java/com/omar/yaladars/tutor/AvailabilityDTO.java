package com.omar.yaladars.tutor;

import java.time.LocalTime;

public class AvailabilityDTO {
    private LocalTime startTime;
    private LocalTime endTime;
    private String dayOfTheWeek;
    private String subject;

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }
    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }
    public String getDayOfTheWeek() { return dayOfTheWeek; }
    public void setDayOfTheWeek(String day) { this.dayOfTheWeek = day; }
    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }
}