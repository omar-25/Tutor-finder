package com.omar.yaladars.search;

import com.omar.yaladars.tutor.Availability;
import com.omar.yaladars.tutor.Tutor;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * TutorSearchSpecification — builds JPA Criteria predicates from a SearchCriteria object.
 *
 * Filters applied:
 *   - keyword  → ILIKE on subjects list (via JOIN) or bio
 *   - subject  → exact match on subjects list
 *   - minPrice / maxPrice → range on hourlyRate
 *   - availability → match dayOfTheWeek in the tutor's Availability records
 *
 * The minRating filter is applied in the service layer after the DB query
 * because average rating is a computed/aggregated value.
 */
public class TutorSearchSpecification implements Specification<Tutor> {

    private final SearchCriteria criteria;

    public TutorSearchSpecification(SearchCriteria criteria) {
        this.criteria = criteria;
    }

    @Override
    public Predicate toPredicate(Root<Tutor> root,
                                 CriteriaQuery<?> query,
                                 CriteriaBuilder cb) {

        List<Predicate> predicates = new ArrayList<>();

        // ── Keyword: match bio OR any subject in the subjects list ──────────
        if (hasValue(criteria.getKeyword())) {
            String pattern = "%" + criteria.getKeyword().toLowerCase() + "%";

            // Join on subjects (ElementCollection → "tutor_subjects" table)
            Join<Tutor, String> subjectJoin = root.join("subjects", JoinType.LEFT);
            query.distinct(true); // avoid duplicate rows from the JOIN

            Predicate bioMatch      = cb.like(cb.lower(root.get("bio")), pattern);
            Predicate subjectMatch  = cb.like(cb.lower(subjectJoin), pattern);

            predicates.add(cb.or(bioMatch, subjectMatch));
        }

        // ── Subject: exact case-insensitive match ────────────────────────────
        if (hasValue(criteria.getSubject())) {
            Join<Tutor, String> subjectJoin = root.join("subjects", JoinType.LEFT);
            query.distinct(true);
            predicates.add(
                cb.equal(cb.lower(subjectJoin),
                         criteria.getSubject().toLowerCase())
            );
        }

        // ── Price range ──────────────────────────────────────────────────────
        if (criteria.getMinPrice() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("hourlyRate"),
                                                   criteria.getMinPrice()));
        }
        if (criteria.getMaxPrice() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("hourlyRate"),
                                                criteria.getMaxPrice()));
        }

        // ── Availability day filter ──────────────────────────────────────────
        if (hasValue(criteria.getAvailability())) {
            // Map frontend labels → DB values stored in Availability.dayOfTheWeek
            String dayFilter = mapAvailabilityLabel(criteria.getAvailability());
            if (dayFilter != null) {
                Join<Tutor, Availability> avJoin = root.join("availabilities", JoinType.LEFT);
                query.distinct(true);
                predicates.add(
                    cb.like(cb.lower(avJoin.get("dayOfTheWeek")),
                            "%" + dayFilter.toLowerCase() + "%")
                );
            }
        }

        return cb.and(predicates.toArray(new Predicate[0]));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private boolean hasValue(String s) {
        return s != null && !s.isBlank();
    }

    /**
     * Maps frontend availability labels to the day strings stored in the DB.
     * Extend this as your Availability data model evolves.
     */
    private String mapAvailabilityLabel(String label) {
        return switch (label.toLowerCase()) {
            case "weekends"  -> "saturday";   // partial match covers Saturday & Sunday
            case "evenings"  -> "evening";
            case "mornings"  -> "morning";
            case "weekdays"  -> "monday";     // partial match catches Mon–Fri if stored consistently
            default          -> null;
        };
    }
}
