package com.omar.yaladars.search;

import com.omar.yaladars.tutor.Availability;
import com.omar.yaladars.tutor.Tutor;
import jakarta.persistence.criteria.*;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

/**
 * TutorSearchSpecification — builds JPA Criteria predicates from SearchCriteria.
 *
 * Fix applied: the subjects ElementCollection is joined at most ONCE per query.
 * Previously, if both keyword and subject filters were active at the same time,
 * two separate LEFT JOINs on the same "subjects" collection were added, which
 * produced a Cartesian product and returned duplicate/wrong results.
 * Now a single join is created and reused for both predicates.
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

        // Create the subjects join ONCE if either keyword or subject filter is active.
        // Re-using the same Join avoids a Cartesian product when both are set.
        boolean needsSubjectJoin = hasValue(criteria.getKeyword()) || hasValue(criteria.getSubject());
        Join<Tutor, String> subjectJoin = null;
        if (needsSubjectJoin) {
            subjectJoin = root.join("subjects", JoinType.LEFT);
            query.distinct(true);
        }

        // ── Keyword: match bio OR any subject in the subjects collection ──────
        if (hasValue(criteria.getKeyword())) {
            String pattern = "%" + criteria.getKeyword().toLowerCase() + "%";
            Predicate bioMatch     = cb.like(cb.lower(root.get("bio")), pattern);
            Predicate subjectMatch = cb.like(cb.lower(subjectJoin), pattern);
            predicates.add(cb.or(bioMatch, subjectMatch));
        }

        // ── Subject: exact case-insensitive match on the same join ────────────
        if (hasValue(criteria.getSubject())) {
            predicates.add(
                cb.equal(cb.lower(subjectJoin), criteria.getSubject().toLowerCase())
            );
        }

        // ── Price range ───────────────────────────────────────────────────────
        if (criteria.getMinPrice() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("hourlyRate"), criteria.getMinPrice()));
        }
        if (criteria.getMaxPrice() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("hourlyRate"), criteria.getMaxPrice()));
        }

        // ── Availability day filter ───────────────────────────────────────────
        if (hasValue(criteria.getAvailability())) {
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

    private boolean hasValue(String s) {
        return s != null && !s.isBlank();
    }

    /**
     * Maps frontend availability labels to substrings stored in Availability.dayOfTheWeek.
     * Uses partial match (LIKE %value%) so "Saturday" and "Sunday" both match "weekend" etc.
     */
    private String mapAvailabilityLabel(String label) {
        return switch (label.toLowerCase()) {
            case "weekends"  -> "saturday";
            case "evenings"  -> "evening";
            case "mornings"  -> "morning";
            case "weekdays"  -> "monday";
            default          -> null;
        };
    }
}
