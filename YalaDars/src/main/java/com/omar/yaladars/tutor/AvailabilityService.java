package com.omar.yaladars.tutor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class AvailabilityService implements ITutorAvailability {

    private final AvailabilityRepository availabilityRepository;
    private final ITutorProfile tutorService;

    @Autowired
    public AvailabilityService(AvailabilityRepository availabilityRepository,
                               ITutorProfile tutorService) {
        this.availabilityRepository = availabilityRepository;
        this.tutorService = tutorService;
    }

    @Override
    public Availability setAvailability(UUID tutorId, AvailabilityDTO dto) {
        Tutor tutor = tutorService.getTutorProfile(tutorId);
        Availability a = new Availability();
        a.setTutor(tutor);
        a.setStartTime(dto.getStartTime());
        a.setEndTime(dto.getEndTime());
        a.setDayOfTheWeek(dto.getDayOfTheWeek());
        a.setSubject(dto.getSubject());
        return availabilityRepository.save(a);
    }

    @Override
    public List<Availability> getAvailability(UUID tutorId) {
        return availabilityRepository.findByTutorTutorId(tutorId);
    }

    @Override
    public Availability updateAvailability(UUID availabilityId, AvailabilityDTO dto) {
        Availability a = availabilityRepository.findById(availabilityId)
                .orElseThrow(() -> new RuntimeException("Not found: " + availabilityId));
        a.setStartTime(dto.getStartTime());
        a.setEndTime(dto.getEndTime());
        a.setDayOfTheWeek(dto.getDayOfTheWeek());
        a.setSubject(dto.getSubject());
        return availabilityRepository.save(a);
    }

    @Override
    public void deleteAvailability(UUID availabilityId) {
        availabilityRepository.deleteById(availabilityId);
    }

    @Override
    public boolean isAvailableAt(UUID tutorId, LocalDateTime dateTime) {
        String day = dateTime.getDayOfWeek().name();
        LocalTime time = dateTime.toLocalTime();
        return availabilityRepository.findByTutorTutorId(tutorId).stream()
                .anyMatch(slot ->
                        slot.getDayOfTheWeek().equalsIgnoreCase(day) &&
                                !time.isBefore(slot.getStartTime()) &&
                                !time.isAfter(slot.getEndTime()));
    }
}