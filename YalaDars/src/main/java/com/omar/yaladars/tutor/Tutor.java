package com.omar.yaladars.tutor;

import com.omar.yaladars.UserManagement.User;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
public class Tutor {

    @Column(name = "user_id")
    private UUID userId;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID tutorId;

    private Double hourlyRate;

    private String bio;

    @ElementCollection
    private List<String> subjects;
    @OneToMany(mappedBy = "tutor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Availability> availabilities = new ArrayList<>();



    public Tutor() {}

    public Tutor(UUID tutorId, Double hourlyRate, String bio, List<String> subjects, UUID userId) {
        this.userId = userId;
        this.tutorId = tutorId;
        this.hourlyRate = hourlyRate;
        this.bio = bio;
        this.subjects = subjects;
    }

    public UUID getTutorId() {
        return tutorId;
    }
    public void setUserId(UUID userId) { this.userId = userId; }

    public UUID getUserId(){
        return userId;
    }

    public void setTutorId(UUID tutorId) {
        this.tutorId = tutorId;
    }

    public Double getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(Double hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public List<String> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<String> subjects) {
        this.subjects = subjects;
    }
    // Add this inside your Tutor class, near the other getters
    public List<Availability> getAvailabilities() {
        return availabilities;
    }

    public void setAvailabilities(List<Availability> availabilities) {
        this.availabilities = availabilities;
    }

}