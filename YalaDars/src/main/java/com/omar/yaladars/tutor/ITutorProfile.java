package com.omar.yaladars.tutor;
import java.util.List;
import java.util.UUID;

public interface ITutorProfile {
    Tutor createTutorProfile(UUID userId, TutorProfileDTO dto);
    Tutor getTutorProfile(UUID tutorId);
    Tutor updateTutorProfile(UUID tutorId, TutorProfileDTO dto);
    void deleteTutorProfile(UUID tutorId);
    Double getTutorRating(UUID tutorId);
    List<Tutor> getAllTutors();
}