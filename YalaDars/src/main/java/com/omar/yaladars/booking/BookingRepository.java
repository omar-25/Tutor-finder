package com.omar.yaladars.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    // Find by student ID (User ID)
    List<Booking> findByStudentId(UUID studentId);

    // Find by tutor ID (User ID)
    List<Booking> findByTutorId(UUID tutorId);

    // Find by tutor ID and status
    List<Booking> findByTutorIdAndStatus(UUID tutorId, BookingStatus status);

    // Find by student ID and status
    List<Booking> findByStudentIdAndStatus(UUID studentId, BookingStatus status);

    // Optional: Custom query to find pending bookings for tutor
    @Query("SELECT b FROM Booking b WHERE b.tutor.id = :tutorId AND b.status = 'PENDING'")
    List<Booking> findPendingBookingsByTutorId(@Param("tutorId") UUID tutorId);
}