package com.omar.yaladars.booking;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface BookingRepository extends JpaRepository<Booking, UUID> {

    List<Booking> findByChildId(UUID childId);

    List<Booking> findByParentId(UUID parentId);

    List<Booking> findByTutorTutorId(UUID tutorId);

    List<Booking> findByTutorTutorIdAndStatus(UUID tutorId, BookingStatus status);

    List<Booking> findByParentIdAndStatus(UUID parentId, BookingStatus status);

    @Query("SELECT b FROM Booking b WHERE b.tutor.tutorId = :tutorId AND b.status = 'PENDING'")
    List<Booking> findPendingBookingsByTutorId(@Param("tutorId") UUID tutorId);
}