package com.omar.yaladars.tutor;

import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    Optional<Tutor> findByUserId(UUID userId);
    // Overriding the default parser with a custom join query
    @Query("SELECT t FROM Tutor t, User u WHERE t.userId = u.id AND u.email = :email")
    Optional<Tutor> findByUserEmail(@Param("email") String email);
}
