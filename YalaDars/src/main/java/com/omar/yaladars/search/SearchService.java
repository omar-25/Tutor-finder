package com.omar.yaladars.search;

import com.omar.yaladars.tutor.Availability;
import com.omar.yaladars.tutor.AvailabilityRepository;
import com.omar.yaladars.tutor.Tutor;
import com.omar.yaladars.tutor.TutorProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SearchService implements ISearch {

    private final TutorProfileRepository searchRepository;
    private final AvailabilityRepository availabilityRepository;

    @Autowired
    public SearchService(TutorProfileRepository searchRepository,
                         AvailabilityRepository availabilityRepository) {
        this.searchRepository       = searchRepository;
        this.availabilityRepository = availabilityRepository;
    }

    @Override
    public Page<TutorSearchResult> searchTutors(SearchCriteria criteria, Pageable pageable) {
        TutorSearchSpecification spec = new TutorSearchSpecification(criteria);
        Page<Tutor> tutorPage = searchRepository.findAll(spec, pageable);

        List<TutorSearchResult> results = tutorPage.getContent()
                .stream()
                .map(this::toSearchResult)
                .filter(r -> passesRatingFilter(r, criteria.getMinRating()))
                .collect(Collectors.toList());

        return new PageImpl<>(results, pageable, tutorPage.getTotalElements());
    }

    @Override
    public Page<TutorSearchResult> quickSearch(String keyword, Pageable pageable) {
        SearchCriteria criteria = new SearchCriteria();
        criteria.setKeyword(keyword);
        return searchTutors(criteria, pageable);
    }

    private TutorSearchResult toSearchResult(Tutor tutor) {
        TutorSearchResult result = new TutorSearchResult();

        result.setTutorId(tutor.getTutorId());
        result.setBio(tutor.getBio());
        result.setHourlyRate(tutor.getHourlyRate());
        result.setSubjects(tutor.getSubjects());

        // FIX 1: Since tutor.getUser() is removed, you will need to fetch names
        // via a User Component/Repository using tutor.getUserId() later.
        // For now, leaving placeholders or setting them to null to prevent compilation errors.
        result.setFirstName(null);
        result.setLastName(null);

        // Rating = 0.0 until Reviews component is built
        result.setAverageRating(0.0);

        // Session count = 0 until SessionManagement component is built
        result.setSessionsCompleted(0);

        // FIX 2: Optimized to use the mapped relationship directly from the Tutor entity
        // instead of firing a separate repository database query for every single tutor item.
        List<String> days = tutor.getAvailabilities().stream()
                .map(Availability::getDayOfTheWeek)
                .distinct()
                .collect(Collectors.toList());
        result.setAvailableDays(days);

        result.setOnline(false);

        return result;
    }

    private boolean passesRatingFilter(TutorSearchResult result, Double minRating) {
        if (minRating == null || minRating == 0.0) return true;
        return result.getAverageRating() >= minRating;
    }
}