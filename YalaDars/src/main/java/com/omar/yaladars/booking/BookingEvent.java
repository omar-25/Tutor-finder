package com.omar.yaladars.booking;

import org.springframework.context.ApplicationEvent;

public class BookingEvent extends ApplicationEvent {

    private final Booking booking;
    private final String eventType;

    public BookingEvent(Object source, Booking booking, String eventType) {
        super(source);
        this.booking = booking;
        this.eventType = eventType;
    }

    public Booking getBooking() { return booking; }
    public String getEventType() { return eventType; }
}