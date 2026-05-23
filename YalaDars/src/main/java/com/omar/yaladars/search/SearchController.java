package com.omar.yaladars.search;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * SearchController — REST layer for the Search & Filter component.
 *
 * Endpoints:
 *   GET  /api/tutors/search          → full filtered + paginated search
 *   GET  /api/tutors/search/quick    → quick keyword-only search
 *
 * All parameters are optional; omitting them returns all tutors.
 */
@RestController
@RequestMapping("/api/tutors/search")
public class SearchController {

    private final ISearch searchService;

    @Autowired
    public SearchController(ISearch searchService) {
        this.searchService = searchService;
    }

    /**
     * Full search endpoint.
     *
     * Query params:
     *   keyword      - free text (name, subject, bio)
     *   subject      - exact subject filter
     *   minPrice     - minimum hourly rate
     *   maxPrice     - maximum hourly rate
     *   minRating    - minimum average rating (0.0 – 5.0)
     *   availability - "Weekdays" | "Weekends" | "Evenings" | "Mornings"
     *   page         - page number (default 0)
     *   size         - page size (default 10)
     *   sortBy       - "rating" | "price" | "sessions" (default: rating)
     *   sortDir      - "asc" | "desc" (default: desc)
     *
     * Example: GET /api/tutors/search?subject=Mathematics&minRating=4.0&page=0&size=10
     */
    @GetMapping
    public ResponseEntity<Page<TutorSearchResult>> search(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) String availability,
            @RequestParam(defaultValue = "0")    int page,
            @RequestParam(defaultValue = "10")   int size,
            @RequestParam(defaultValue = "rating") String sortBy,
            @RequestParam(defaultValue = "desc")   String sortDir
    ) {
        // Build criteria from query params
        SearchCriteria criteria = new SearchCriteria(
                keyword, subject, minPrice, maxPrice, minRating, availability
        );

        // Build pageable with sorting
        Sort sort = buildSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<TutorSearchResult> results = searchService.searchTutors(criteria, pageable);
        return ResponseEntity.ok(results);
    }

    /**
     * Quick search endpoint — keyword only, no filters.
     *
     * Example: GET /api/tutors/search/quick?q=math&page=0&size=5
     */
    @GetMapping("/quick")
    public ResponseEntity<Page<TutorSearchResult>> quickSearch(
            @RequestParam String q,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "5")  int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "hourlyRate"));
        Page<TutorSearchResult> results = searchService.quickSearch(q, pageable);
        return ResponseEntity.ok(results);
    }

    // ── Helper ───────────────────────────────────────────────────────────────

    private Sort buildSort(String sortBy, String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        String field = switch (sortBy.toLowerCase()) {
            case "price"    -> "hourlyRate";
            case "sessions" -> "hourlyRate"; // replace with sessions field once available
            default         -> "hourlyRate"; // "rating" is post-query; DB sort by price as fallback
        };

        return Sort.by(direction, field);
    }
}
