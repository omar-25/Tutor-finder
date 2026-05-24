package com.omar.yaladars.tutor;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Single repository for the Tutor entity.
 * Extends JpaSpecificationExecutor so both TutorService and SearchService
 * can use dynamic filtered queries. TutorSearchRepository is removed —
 * this is the only Tutor repository in the application.
 */
@Repository
public interface TutorProfileRepository
        extends JpaRepository<Tutor, UUID>, JpaSpecificationExecutor<Tutor> {

    Optional<Tutor> findByUserEmail(String email);
    Optional<Tutor> findByUserId(UUID userId);
}
