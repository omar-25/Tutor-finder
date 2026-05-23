package com.omar.yaladars.tutor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/tutors")
public class TutorController {

    private final ITutorProfile tutorService;

    @Autowired
    public TutorController(ITutorProfile tutorService) {
        this.tutorService = tutorService;
    }

    @PostMapping
    public ResponseEntity<Tutor> create(@RequestBody TutorProfileDTO dto) {
        return ResponseEntity.ok(tutorService.createTutorProfile(null, dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tutor> get(@PathVariable UUID id) {
        return ResponseEntity.ok(tutorService.getTutorProfile(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Tutor> update(@PathVariable UUID id,
                                        @RequestBody TutorProfileDTO dto) {
        return ResponseEntity.ok(tutorService.updateTutorProfile(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        tutorService.deleteTutorProfile(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/rating")
    public ResponseEntity<Double> rating(@PathVariable UUID id) {
        return ResponseEntity.ok(tutorService.getTutorRating(id));
    }

}