package com.omar.yaladars.tutor;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface TutorProfileRepository extends JpaRepository<Tutor, UUID> {
}