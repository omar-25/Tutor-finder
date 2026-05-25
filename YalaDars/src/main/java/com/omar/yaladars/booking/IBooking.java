package com.omar.yaladars.booking;

import java.util.List;
import java.util.UUID;

public interface IBooking {

    BookingDTO createBooking(BookingDTO dto);
    BookingDTO getBookingById(UUID id);
    List<BookingDTO> getStudentBookings(UUID studentId);
    List<BookingDTO> getTutorBookings(UUID tutorId);
    BookingDTO acceptBooking(UUID bookingId);
    BookingDTO rejectBooking(UUID bookingId, String reason);
    BookingDTO cancelBooking(UUID bookingId);
    BookingDTO completeBooking(UUID bookingId);
    BookingDTO rescheduleBooking(UUID bookingId, BookingDTO dto);
    List<BookingDTO> getPendingBookingsForTutor(UUID tutorId);
}