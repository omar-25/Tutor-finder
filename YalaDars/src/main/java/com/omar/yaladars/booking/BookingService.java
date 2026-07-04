package com.omar.yaladars.booking;

import com.omar.yaladars.UserManagement.User;
import com.omar.yaladars.UserManagement.UserRepository;
import com.omar.yaladars.child.Child;
import com.omar.yaladars.child.ChildRepository;
import com.omar.yaladars.tutor.Tutor;
import com.omar.yaladars.tutor.TutorProfileRepository;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BookingService implements IBooking {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final TutorProfileRepository tutorRepository;
    private final ChildRepository childRepository;
    private final ApplicationEventPublisher eventPublisher;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          TutorProfileRepository tutorRepository,
                          ChildRepository childRepository,
                          ApplicationEventPublisher eventPublisher) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.tutorRepository = tutorRepository;
        this.childRepository = childRepository;
        this.eventPublisher = eventPublisher;
    }

    @Override
    public BookingDTO createBooking(BookingDTO dto) {
        Child child = childRepository.findById(dto.getChildId())
                .orElseThrow(() -> new RuntimeException("Child not found: " + dto.getChildId()));

        User parent = userRepository.findById(dto.getParentId())
                .orElseThrow(() -> new RuntimeException("Parent not found: " + dto.getParentId()));

        Tutor tutor = tutorRepository.findById(dto.getTutorId())
                .orElseThrow(() -> new RuntimeException("Tutor not found: " + dto.getTutorId()));

        Booking booking = new Booking();
        booking.setChild(child);
        booking.setParent(parent);
        booking.setTutor(tutor);
        booking.setSubject(dto.getSubject());
        booking.setSessionTime(dto.getSessionTime());
        booking.setTotalAmount(dto.getTotalAmount());
        booking.setNotes(dto.getNotes());
        booking.setStatus(BookingStatus.PENDING);

        Booking saved = bookingRepository.save(booking);
        eventPublisher.publishEvent(new BookingEvent(this, saved, "CREATED"));
        return new BookingDTO(saved);
    }

    @Override
    public BookingDTO getBookingById(UUID id) {
        return new BookingDTO(bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id)));
    }

    public List<BookingDTO> getParentBookings(UUID parentId) {
        return bookingRepository.findByParentId(parentId)
                .stream().map(BookingDTO::new).collect(Collectors.toList());
    }

    public List<BookingDTO> getChildBookings(UUID childId) {
        return bookingRepository.findByChildId(childId)
                .stream().map(BookingDTO::new).collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> getTutorBookings(UUID tutorId) {
        return bookingRepository.findByTutorTutorId(tutorId)
                .stream().map(BookingDTO::new).collect(Collectors.toList());
    }

    public List<BookingDTO> getPendingBookingsForTutor(UUID tutorId) {
        return bookingRepository.findPendingBookingsByTutorId(tutorId)
                .stream().map(BookingDTO::new).collect(Collectors.toList());
    }

    @Override
    public BookingDTO acceptBooking(UUID bookingId) {
        Booking booking = getOrThrow(bookingId);
        booking.setStatus(BookingStatus.ACCEPTED);
        Booking saved = bookingRepository.save(booking);
        eventPublisher.publishEvent(new BookingEvent(this, saved, "ACCEPTED"));
        return new BookingDTO(saved);
    }

    @Override
    public BookingDTO rejectBooking(UUID bookingId, String reason) {
        Booking booking = getOrThrow(bookingId);
        booking.setStatus(BookingStatus.REJECTED);
        booking.setNotes(reason);
        Booking saved = bookingRepository.save(booking);
        eventPublisher.publishEvent(new BookingEvent(this, saved, "REJECTED"));
        return new BookingDTO(saved);
    }

    @Override
    public BookingDTO cancelBooking(UUID bookingId) {
        Booking booking = getOrThrow(bookingId);
        booking.setStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        eventPublisher.publishEvent(new BookingEvent(this, saved, "CANCELLED"));
        return new BookingDTO(saved);
    }

    @Override
    public BookingDTO completeBooking(UUID bookingId) {
        Booking booking = getOrThrow(bookingId);
        booking.setStatus(BookingStatus.COMPLETED);
        Booking saved = bookingRepository.save(booking);
        eventPublisher.publishEvent(new BookingEvent(this, saved, "COMPLETED"));
        return new BookingDTO(saved);
    }

    @Override
    public BookingDTO rescheduleBooking(UUID bookingId, BookingDTO dto) {
        Booking booking = getOrThrow(bookingId);
        booking.setSessionTime(dto.getSessionTime());
        booking.setStatus(BookingStatus.RESCHEDULED);
        Booking saved = bookingRepository.save(booking);
        eventPublisher.publishEvent(new BookingEvent(this, saved, "RESCHEDULED"));
        return new BookingDTO(saved);
    }

    // Removed getStudentBookings — use getParentBookings / getChildBookings instead
    @Override
    public List<BookingDTO> getStudentBookings(UUID studentId) {
        // Kept for interface compat — delegates to parent bookings
        return getParentBookings(studentId);
    }

    private Booking getOrThrow(UUID id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + id));
    }
}