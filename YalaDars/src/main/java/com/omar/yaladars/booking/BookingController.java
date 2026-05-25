package com.omar.yaladars.booking;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingDTO dto) {
        return ResponseEntity.ok(bookingService.createBooking(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<BookingDTO>> getStudentBookings(@PathVariable UUID studentId) {
        return ResponseEntity.ok(bookingService.getStudentBookings(studentId));
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<BookingDTO>> getTutorBookings(
            @PathVariable UUID tutorId,
            @RequestParam(required = false) String status) {

        if (status != null && status.equalsIgnoreCase("PENDING")) {
            return ResponseEntity.ok(bookingService.getPendingBookingsForTutor(tutorId));
        }
        return ResponseEntity.ok(bookingService.getTutorBookings(tutorId));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<BookingDTO> acceptBooking(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.acceptBooking(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<BookingDTO> rejectBooking(@PathVariable UUID id,
                                                    @RequestParam String reason) {
        return ResponseEntity.ok(bookingService.rejectBooking(id, reason));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingDTO> cancelBooking(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<BookingDTO> completeBooking(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.completeBooking(id));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<BookingDTO> rescheduleBooking(@PathVariable UUID id,
                                                        @RequestBody BookingDTO dto) {
        return ResponseEntity.ok(bookingService.rescheduleBooking(id, dto));
    }
}