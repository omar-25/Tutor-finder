package com.omar.yaladars.booking;

import com.omar.yaladars.UserManagement.User;
import com.omar.yaladars.UserManagement.UserRepository;
import com.omar.yaladars.tutor.Tutor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import com.omar.yaladars.tutor.TutorProfileRepository;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService implements IBooking {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TutorProfileRepository tutorRepository;
    private final ApplicationEventPublisher eventPublisher;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          TutorProfileRepository tutorRepository,
                          ApplicationEventPublisher eventPublisher) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.tutorRepository = tutorRepository;
        this.eventPublisher = eventPublisher;
    }

    private BookingDTO convertToDTO(Booking booking) {
        return new BookingDTO(booking);
    }

    @Override
    public BookingDTO createBooking(BookingDTO dto) {
        User student = userRepository.findById(dto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found: " + dto.getStudentId()));

        // Find tutor profile first, then get the linked user
        Tutor tutorProfile = tutorRepository.findById(dto.getTutorId())
                .orElseThrow(() -> new RuntimeException("Tutor not found: " + dto.getTutorId()));

        User tutor = userRepository.findById(tutorProfile.getUserId())
                .orElseThrow(() -> new RuntimeException("Tutor user not found: " + tutorProfile.getUserId()));

        System.out.println("=== Creating Booking ===");
        System.out.println("studentId: " + dto.getStudentId());
        System.out.println("tutorId: " + dto.getTutorId());
        System.out.println("subject: " + dto.getSubject());
        System.out.println("startTime: " + dto.getStartTime());
        System.out.println("endTime: " + dto.getEndTime());
        System.out.println("totalAmount: " + dto.getTotalAmount());

        Booking booking = new Booking();
        booking.setStudent(student);
        booking.setTutor(tutor);
        booking.setSubject(dto.getSubject());
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setTotalAmount(dto.getTotalAmount());
        booking.setNotes(dto.getNotes());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        eventPublisher.publishEvent(new BookingEvent(this, saved, "CREATED"));
        System.out.println("Booking created with ID: " + saved.getId() + ", Status: " + saved.getStatus());
        return new BookingDTO(saved);
    }

    @Override
    public BookingDTO getBookingById(UUID id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id));
        return new BookingDTO(booking);
    }

    @Override
    public List<BookingDTO> getStudentBookings(UUID studentId) {
        System.out.println("Fetching bookings for student: " + studentId);
        List<Booking> bookings = bookingRepository.findByStudentId(studentId);
        System.out.println("Found " + bookings.size() + " bookings for student");
        return bookings.stream()
                .map(BookingDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> getTutorBookings(UUID tutorId) {
        System.out.println("Fetching ALL bookings for tutor: " + tutorId);
        // tutorId here is the User ID of the tutor
        List<Booking> bookings = bookingRepository.findByTutorId(tutorId);
        System.out.println("Found " + bookings.size() + " total bookings for tutor");

        // Log each booking's status
        for (Booking booking : bookings) {
            System.out.println("Booking ID: " + booking.getId() +
                    ", Status: " + booking.getStatus() +
                    ", Subject: " + booking.getSubject());
        }

        return bookings.stream()
                .map(BookingDTO::new)
                .collect(Collectors.toList());
    }

    // Specific method for pending bookings only
    public List<BookingDTO> getPendingBookingsForTutor(UUID tutorId) {
        System.out.println("Fetching PENDING bookings for tutor: " + tutorId);
        List<Booking> bookings = bookingRepository.findByTutorIdAndStatus(tutorId, BookingStatus.PENDING);
        System.out.println("Found " + bookings.size() + " pending bookings for tutor");
        return bookings.stream()
                .map(BookingDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public BookingDTO acceptBooking(UUID bookingId) {
        System.out.println("Accepting booking: " + bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));
        booking.setStatus(BookingStatus.ACCEPTED);
        Booking saved = bookingRepository.save(booking);
        eventPublisher.publishEvent(new BookingEvent(this, saved, "ACCEPTED"));
        System.out.println("Booking " + bookingId + " status changed to ACCEPTED");
        return new BookingDTO(saved);
    }

    @Override
    public BookingDTO rejectBooking(UUID bookingId, String reason) {
        System.out.println("Rejecting booking: " + bookingId + ", reason: " + reason);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));
        booking.setStatus(BookingStatus.REJECTED);
        booking.setNotes(reason); // Store rejection reason in notes
        Booking saved = bookingRepository.save(booking);
        eventPublisher.publishEvent(new BookingEvent(this, saved, "REJECTED"));
        System.out.println("Booking " + bookingId + " status changed to REJECTED");
        return new BookingDTO(saved);
    }

    @Override
    public BookingDTO cancelBooking(UUID bookingId) {
        System.out.println("Cancelling booking: " + bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));
        booking.setStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        eventPublisher.publishEvent(new BookingEvent(this, saved, "CANCELLED"));
        System.out.println("Booking " + bookingId + " status changed to CANCELLED");
        return new BookingDTO(saved);
    }

    @Override
    public BookingDTO completeBooking(UUID bookingId) {
        System.out.println("Completing booking: " + bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));
        booking.setStatus(BookingStatus.COMPLETED);
        Booking saved = bookingRepository.save(booking);
        eventPublisher.publishEvent(new BookingEvent(this, saved, "COMPLETED"));
        System.out.println("Booking " + bookingId + " status changed to COMPLETED");
        return new BookingDTO(saved);
    }

    @Override
    public BookingDTO rescheduleBooking(UUID bookingId, BookingDTO dto) {
        System.out.println("Rescheduling booking: " + bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));
        booking.setStartTime(dto.getStartTime());
        booking.setEndTime(dto.getEndTime());
        booking.setStatus(BookingStatus.RESCHEDULED);
        Booking saved = bookingRepository.save(booking);
        eventPublisher.publishEvent(new BookingEvent(this, saved, "RESCHEDULED"));
        System.out.println("Booking " + bookingId + " rescheduled to: " + dto.getStartTime());
        return new BookingDTO(saved);
    }
}