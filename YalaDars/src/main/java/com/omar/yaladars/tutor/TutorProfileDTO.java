package com.omar.yaladars.tutor;

import java.util.List;
import java.util.UUID;

public class TutorProfileDTO {
    private UUID userId;
    private Double hourlyRate;
    private String bio;
    private List<String> subjects;

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public List<String> getSubjects() { return subjects; }
    public void setSubjects(List<String> subjects) { this.subjects = subjects; }
}