package com.omar.yaladars.search;

import com.omar.yaladars.tutor.Tutor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * TutorSearchRepository — used by SearchService for dynamic filtered queries.
 * Rating and session count are returned as 0 until Reviews/Sessions are built.
 */
@Repository
public interface TutorSearchRepository
        extends JpaRepository<Tutor, UUID>, JpaSpecificationExecutor<Tutor> {
    // No @Query methods here — Review and Session entities don't exist yet.
    // Rating and session count are set to 0 directly in SearchService.
}
