import React, { useState, useEffect, useCallback } from 'react';
import SearchFilter from './SearchFilter';
import TutorCard from './TutorCard';
import './TutorSearch.css';

// ─── Mock data (replace with API calls to /api/tutors/search) ───────────────
const MOCK_TUTORS = [
  {
    id: 1, name: 'Sarah El-Masry', isOnline: true,
    subjects: ['Mathematics', 'Calculus', 'Statistics'],
    rating: 4.9, reviewCount: 128, sessionsCompleted: 312, hourlyRate: 45,
    bio: 'PhD candidate at Cairo University with 5 years of tutoring experience. I make complex maths accessible and fun.',
    availability: ['Weekdays', 'Evenings'],
  },
  {
    id: 2, name: 'Ahmed Khalil', isOnline: false,
    subjects: ['Physics', 'Mathematics', 'Algebra'],
    rating: 4.7, reviewCount: 84, sessionsCompleted: 215, hourlyRate: 35,
    bio: 'Former high school teacher turned professional tutor. I specialise in exam preparation and concept clarity.',
    availability: ['Weekends', 'Mornings'],
  },
  {
    id: 3, name: 'Nour Hassan', isOnline: true,
    subjects: ['English', 'Writing', 'Literature'],
    rating: 4.8, reviewCount: 96, sessionsCompleted: 180, hourlyRate: 30,
    bio: 'Native English speaker with a Master\'s in English Literature. I help students find their voice in writing.',
    availability: ['Weekdays', 'Afternoons'],
  },
  {
    id: 4, name: 'Omar Fawzy', isOnline: false,
    subjects: ['Computer Science', 'Programming', 'Python', 'Web Dev'],
    rating: 4.6, reviewCount: 62, sessionsCompleted: 140, hourlyRate: 55,
    bio: 'Senior software engineer helping students break into tech. Covers data structures, algorithms, and real projects.',
    availability: ['Evenings', 'Weekends'],
  },
  {
    id: 5, name: 'Mariam Youssef', isOnline: true,
    subjects: ['Chemistry', 'Biology', 'Biochemistry'],
    rating: 4.9, reviewCount: 110, sessionsCompleted: 263, hourlyRate: 40,
    bio: 'Medical student with a passion for making science approachable. Highly effective for pre-med students.',
    availability: ['Weekdays', 'Weekends'],
  },
  {
    id: 6, name: 'Karim Nabil', isOnline: false,
    subjects: ['Economics', 'Statistics', 'Accounting'],
    rating: 4.5, reviewCount: 47, sessionsCompleted: 95, hourlyRate: 38,
    bio: 'Chartered accountant helping students ace their finance and economics exams with real-world examples.',
    availability: ['Evenings', 'Weekends'],
  },
];

const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'reviews', label: 'Most Reviewed' },
  { value: 'sessions', label: 'Most Experienced' },
];

// ─── Filtering logic ─────────────────────────────────────────────────────────
function applyFilters(tutors, filters, sortBy) {
  let result = [...tutors];

  // Text search
  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.subjects.some((s) => s.toLowerCase().includes(q)) ||
        t.bio?.toLowerCase().includes(q)
    );
  }

  // Subject
  if (filters.subject && filters.subject !== 'All Subjects') {
    result = result.filter((t) =>
      t.subjects.some((s) => s.toLowerCase() === filters.subject.toLowerCase())
    );
  }

  // Price range
  if (filters.priceRange && filters.priceRange !== 'Any Price') {
    const map = {
      'Under $20/hr': [0, 20],
      '$20 – $50/hr': [20, 50],
      '$50 – $100/hr': [50, 100],
      '$100+/hr': [100, Infinity],
    };
    const [min, max] = map[filters.priceRange] || [0, Infinity];
    result = result.filter((t) => t.hourlyRate >= min && t.hourlyRate <= max);
  }

  // Rating
  if (filters.minRating && filters.minRating > 0) {
    result = result.filter((t) => t.rating >= filters.minRating);
  }

  // Availability
  if (filters.availability && filters.availability !== 'Any Time') {
    const avMap = {
      'Today': null, // Would need real API
      'This Week': null,
      'Weekends': 'Weekends',
      'Evenings': 'Evenings',
    };
    const avFilter = avMap[filters.availability];
    if (avFilter) {
      result = result.filter((t) =>
        t.availability.some((a) => a.toLowerCase().includes(avFilter.toLowerCase()))
      );
    }
  }

  // Sort
  result.sort((a, b) => {
    switch (sortBy) {
      case 'rating': return b.rating - a.rating;
      case 'price_asc': return a.hourlyRate - b.hourlyRate;
      case 'price_desc': return b.hourlyRate - a.hourlyRate;
      case 'reviews': return b.reviewCount - a.reviewCount;
      case 'sessions': return b.sessionsCompleted - a.sessionsCompleted;
      default: return 0;
    }
  });

  return result;
}

// ─── Component ────────────────────────────────────────────────────────────────
const TutorSearch = () => {
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('rating');
  const [results, setResults] = useState(MOCK_TUTORS);
  const [isLoading, setIsLoading] = useState(false);

  // In production, replace this with a real API call:
  // const fetchTutors = async (filters) => {
  //   const res = await fetch(`/api/tutors/search?${new URLSearchParams(filters)}`);
  //   return res.json();
  // };

  const runSearch = useCallback(
    (newFilters) => {
      setIsLoading(true);
      setFilters(newFilters);
      // Simulate network latency
      setTimeout(() => {
        setResults(applyFilters(MOCK_TUTORS, newFilters, sortBy));
        setIsLoading(false);
      }, 300);
    },
    [sortBy]
  );

  // Re-sort when sort changes
  useEffect(() => {
    setResults(applyFilters(MOCK_TUTORS, filters, sortBy));
  }, [sortBy]);

  const handleBook = (tutor) => {
    // Navigate to booking page — wire to your router
    alert(`Booking flow for ${tutor.name} — connect to /booking?tutorId=${tutor.id}`);
  };

  const handleViewProfile = (id) => {
    alert(`View profile — connect to /tutors/${id}`);
  };

  return (
    <div className="tutor-search-page">
      {/* Hero strip */}
      <div className="search-hero">
        <div className="search-hero__inner">
          <h1 className="search-hero__title">Find Your Perfect Tutor</h1>
          <p className="search-hero__sub">
            Browse {MOCK_TUTORS.length}+ expert tutors across every subject
          </p>
          <SearchFilter onSearch={runSearch} onFilterChange={runSearch} />
        </div>
      </div>

      {/* Results area */}
      <div className="search-results-area">
        {/* Toolbar */}
        <div className="results-toolbar">
          <span className="results-count">
            {isLoading
              ? 'Searching…'
              : `${results.length} tutor${results.length !== 1 ? 's' : ''} found`}
          </span>
          <div className="sort-wrap">
            <label htmlFor="sort-select" className="sort-label">Sort by</label>
            <select
              id="sort-select"
              className="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="results-loading">
            {[1, 2, 3].map((i) => (
              <div key={i} className="tutor-card-skeleton" />
            ))}
          </div>
        ) : results.length === 0 ? (
          <div className="results-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <h3>No tutors found</h3>
            <p>Try adjusting your search terms or clearing some filters.</p>
          </div>
        ) : (
          <div className="tutor-grid">
            {results.map((tutor, idx) => (
              <div key={tutor.id} style={{ animationDelay: `${idx * 60}ms` }}>
                <TutorCard
                  tutor={tutor}
                  onBook={handleBook}
                  onViewProfile={handleViewProfile}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorSearch;
