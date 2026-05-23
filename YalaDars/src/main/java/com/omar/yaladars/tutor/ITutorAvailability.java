package com.omar.yaladars.tutor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface ITutorAvailability {
    Availability setAvailability(UUID tutorId, AvailabilityDTO dto);
    List<Availability> getAvailability(UUID tutorId);
    Availability updateAvailability(UUID availabilityId, AvailabilityDTO dto);
    void deleteAvailability(UUID availabilityId);
    boolean isAvailableAt(UUID tutorId, LocalDateTime dateTime);
}