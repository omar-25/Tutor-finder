package com.omar.yaladars.search;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * ISearch — the Search & Filter component interface (from component diagram).
 * Consumes ITutorProfile data and produces a ListOfTutors result.
 */
public interface ISearch {

    /**
     * Full search with all filter criteria.
     *
     * @param criteria  the search and filter parameters
     * @param pageable  pagination and sorting
     * @return          paginated list of matching tutor results
     */
    Page<TutorSearchResult> searchTutors(SearchCriteria criteria, Pageable pageable);

    /**
     * Quick keyword search by name or subject only.
     *
     * @param keyword   text to match against tutor name or subjects
     * @param pageable  pagination
     * @return          paginated list of matching tutor results
     */
    Page<TutorSearchResult> quickSearch(String keyword, Pageable pageable);
}
