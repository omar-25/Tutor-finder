package com.omar.yaladars.tutor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.UUID;

@Service
public class TutorService implements ITutorProfile {

    private final TutorProfileRepository tutorRepository;

    @Autowired
    public TutorService(TutorProfileRepository tutorRepository) {
        this.tutorRepository = tutorRepository;
    }

    @Override
    public Tutor createTutorProfile(UUID userId, TutorProfileDTO dto) {
        Tutor tutor = new Tutor();
        tutor.setHourlyRate(dto.getHourlyRate());
        tutor.setBio(dto.getBio());
        tutor.setSubjects(dto.getSubjects());
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
        return 0.0;
    }
}