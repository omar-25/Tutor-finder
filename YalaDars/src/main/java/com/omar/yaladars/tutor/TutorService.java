package com.omar.yaladars.tutor;

import com.omar.yaladars.UserManagement.User;
import com.omar.yaladars.UserManagement.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class TutorService implements ITutorProfile {

    private final TutorProfileRepository tutorRepository;
    private final UserRepository userRepository;

    @Autowired
    public TutorService(TutorProfileRepository tutorRepository,
                        UserRepository userRepository) {
        this.tutorRepository = tutorRepository;
        this.userRepository  = userRepository;
    }

    /**
     * Creates a Tutor profile and links it to the User account identified
     * by userId. This wires the Tutor.user foreign key so SearchService
     * can return the tutor's name from the User table.
     */
    @Override
    public Tutor createTutorProfile(UUID userId, TutorProfileDTO dto) {
        Tutor tutor = new Tutor();
        tutor.setHourlyRate(dto.getHourlyRate());
        tutor.setBio(dto.getBio());
        tutor.setSubjects(dto.getSubjects());

        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found: " + userId));
            tutor.setUser(user);
        }

        return tutorRepository.save(tutor);
    }

    @Override
    public Tutor getTutorProfile(UUID tutorId) {
        return tutorRepository.findById(tutorId)
                .orElseThrow(() -> new RuntimeException("Tutor not found: " + tutorId));
    }

    @Override
    public Tutor updateTutorProfile(UUID tutorId, TutorProfileDTO dto) {
        Tutor tutor = getTutorProfile(tutorId);
        tutor.setHourlyRate(dto.getHourlyRate());
        tutor.setBio(dto.getBio());
        tutor.setSubjects(dto.getSubjects());
        return tutorRepository.save(tutor);
    }

    @Override
    public void deleteTutorProfile(UUID tutorId) {
        tutorRepository.deleteById(tutorId);
    }

    @Override
    public Double getTutorRating(UUID tutorId) {
        // Returns 0.0 until the Reviews component is built
        return 0.0;
    }
}
