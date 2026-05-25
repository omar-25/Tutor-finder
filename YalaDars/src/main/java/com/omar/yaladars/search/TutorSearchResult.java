package com.omar.yaladars.search;

import java.util.List;
import java.util.UUID;

/**
 * TutorSearchResult — one item in the ListOfTutors returned by the Search component.
 * Combines data from Tutor, User, Availability, and the computed average rating.
 */
public class TutorSearchResult {

    private UUID   tutorId;
    private String firstName;
    private String lastName;
    private String bio;
    private Double hourlyRate;
    private List<String> subjects;
    private Double averageRating;
    private int    reviewCount;
    private int    sessionsCompleted;
    private List<String> availableDays;   // e.g. ["Monday", "Wednesday", "Friday"]
    private boolean online;               // placeholder — set via presence service later

    public TutorSearchResult() {}

    // ── Getters & Setters ───────────────────────────────────────────────────

    public UUID getTutorId()                          { return tutorId; }
    public void setTutorId(UUID tutorId)              { this.tutorId = tutorId; }

    public String getFirstName()                      { return firstName; }
    public void setFirstName(String firstName)        { this.firstName = firstName; }

    public String getLastName()                       { return lastName; }
    public void setLastName(String lastName)          { this.lastName = lastName; }

    public String getFullName()                       { return firstName + " " + lastName; }

    public String getBio()                            { return bio; }
    public void setBio(String bio)                    { this.bio = bio; }

    public Double getHourlyRate()                     { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate)      { this.hourlyRate = hourlyRate; }

    public List<String> getSubjects()                 { return subjects; }
    public void setSubjects(List<String> subjects)    { this.subjects = subjects; }

    public Double getAverageRating()                  { return averageRating; }
    public void setAverageRating(Double r)            { this.averageRating = r; }

    public int getReviewCount()                       { return reviewCount; }
    public void setReviewCount(int reviewCount)       { this.reviewCount = reviewCount; }

    public int getSessionsCompleted()                 { return sessionsCompleted; }
    public void setSessionsCompleted(int s)           { this.sessionsCompleted = s; }

    public List<String> getAvailableDays()            { return availableDays; }
    public void setAvailableDays(List<String> days)   { this.availableDays = days; }

    public boolean isOnline()                         { return online; }
    public void setOnline(boolean online)             { this.online = online; }
}
