package com.omar.yaladars.tutor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/availability")
public class AvailabilityController {

    private final ITutorAvailability availabilityService;

    @Autowired
    public AvailabilityController(ITutorAvailability availabilityService) {
        this.availabilityService = availabilityService;
    }

    @PostMapping
    public ResponseEntity<Availability> set(@RequestParam UUID tutorId,
                                            @RequestBody AvailabilityDTO dto) {
        return ResponseEntity.ok(availabilityService.setAvailability(tutorId, dto));
    }

    @GetMapping("/tutor/{tutorId}")
    public ResponseEntity<List<Availability>> get(@PathVariable UUID tutorId) {
        return ResponseEntity.ok(availabilityService.getAvailability(tutorId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Availability> update(@PathVariable UUID id,
                                               @RequestBody AvailabilityDTO dto) {
        return ResponseEntity.ok(availabilityService.updateAvailability(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> check(
            @RequestParam UUID tutorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime dateTime) {
        return ResponseEntity.ok(availabilityService.isAvailableAt(tutorId, dateTime));
    }
}