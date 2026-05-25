import React, { useState } from 'react';
import './SearchFilter.css';

const SUBJECTS = [
    'All Subjects', 'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'English', 'Arabic', 'History', 'Computer Science', 'Programming',
    'Economics', 'Statistics', 'Calculus', 'Algebra', 'Geography'
];

const PRICE_RANGES = [
    { label: 'Any Price', min: 0, max: Infinity },
    { label: 'Under $20/hr', min: 0, max: 20 },
    { label: '$20 – $50/hr', min: 20, max: 50 },
    { label: '$50 – $100/hr', min: 50, max: 100 },
    { label: '$100+/hr', min: 100, max: Infinity },
];

const RATINGS = [
    { label: 'Any Rating', value: 0 },
    { label: '4.5+ Stars', value: 4.5 },
    { label: '4.0+ Stars', value: 4.0 },
    { label: '3.5+ Stars', value: 3.5 },
];

const AVAILABILITY = ['Any Time', 'Today', 'This Week', 'Weekends', 'Evenings'];

const SearchFilter = ({ onSearch, onFilterChange, initialValues = {} }) => {
    const [query, setQuery] = useState(initialValues.query || '');
    const [subject, setSubject] = useState(initialValues.subject || 'All Subjects');
    const [priceRange, setPriceRange] = useState(initialValues.priceRange || 'Any Price');
    const [minRating, setMinRating] = useState(initialValues.minRating || 0);
    const [availability, setAvailability] = useState(initialValues.availability || 'Any Time');
    const [showFilters, setShowFilters] = useState(false);

    const activeFilterCount = [
        subject !== 'All Subjects',
        priceRange !== 'Any Price',
        minRating !== 0,
        availability !== 'Any Time',
    ].filter(Boolean).length;

    const handleSearch = (e) => {
        e?.preventDefault();
        const filters = { query, subject, priceRange, minRating, availability };
        onSearch?.(filters);
        onFilterChange?.(filters);
    };

    const handleQueryChange = (e) => {
        setQuery(e.target.value);
    };

    const clearFilters = () => {
        setSubject('All Subjects');
        setPriceRange('Any Price');
        setMinRating(0);
        setAvailability('Any Time');
        const filters = { query, subject: 'All Subjects', priceRange: 'Any Price', minRating: 0, availability: 'Any Time' };
        onFilterChange?.(filters);
    };

    return (
        <div className="search-filter-container">
            {/* Main Search Bar */}
            <form className="search-bar-wrapper" onSubmit={handleSearch}>
                <div className="search-icon-wrap">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                </div>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by name, subject, or keyword…"
                    value={query}
                    onChange={handleQueryChange}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                {query && (
                    <button type="button" className="search-clear-btn" onClick={() => { setQuery(''); }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                )}
                <button
                    type="button"
                    className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
                    onClick={() => setShowFilters(!showFilters)}
                    aria-label="Toggle filters"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="filter-badge">{activeFilterCount}</span>
                    )}
                </button>
                <button type="submit" className="search-submit-btn">
                    Search
                </button>
            </form>

            {/* Filter Panel */}
            <div className={`filter-panel ${showFilters ? 'filter-panel--open' : ''}`}>
                <div className="filter-grid">
                    {/* Subject */}
                    <div className="filter-group">
                        <label className="filter-label">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                            Subject
                        </label>
                        <select
                            className="filter-select"
                            value={subject}
                            onChange={(e) => { setSubject(e.target.value); }}
                        >
                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    {/* Price Range */}
                    <div className="filter-group">
                        <label className="filter-label">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 6v2m0 8v2"/></svg>
                            Price Range
                        </label>
                        <select
                            className="filter-select"
                            value={priceRange}
                            onChange={(e) => { setPriceRange(e.target.value); }}
                        >
                            {PRICE_RANGES.map(p => <option key={p.label} value={p.label}>{p.label}</option>)}
                        </select>
                    </div>

                    {/* Rating */}
                    <div className="filter-group">
                        <label className="filter-label">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                            Min Rating
                        </label>
                        <select
                            className="filter-select"
                            value={minRating}
                            onChange={(e) => { setMinRating(Number(e.target.value)); }}
                        >
                            {RATINGS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                    </div>

                    {/* Availability */}
                    <div className="filter-group">
                        <label className="filter-label">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                            Availability
                        </label>
                        <select
                            className="filter-select"
                            value={availability}
                            onChange={(e) => { setAvailability(e.target.value); }}
                        >
                            {AVAILABILITY.map(a => <option key={a} value={a}>{a}</option>)}
                        </select>
                    </div>
                </div>

                {/* Filter actions */}
                <div className="filter-actions">
                    {activeFilterCount > 0 && (
                        <button type="button" className="clear-filters-btn" onClick={clearFilters}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            Clear filters
                        </button>
                    )}
                    <button type="button" className="apply-filters-btn" onClick={handleSearch}>
                        Apply Filters
                    </button>
                </div>
            </div>

            {/* Active Filter Pills */}
            {activeFilterCount > 0 && (
                <div className="active-filters">
                    {subject !== 'All Subjects' && (
                        <span className="filter-pill">
              {subject}
                            <button onClick={() => setSubject('All Subjects')}>×</button>
            </span>
                    )}
                    {priceRange !== 'Any Price' && (
                        <span className="filter-pill">
              {priceRange}
                            <button onClick={() => setPriceRange('Any Price')}>×</button>
            </span>
                    )}
                    {minRating !== 0 && (
                        <span className="filter-pill">
              {RATINGS.find(r => r.value === minRating)?.label}
                            <button onClick={() => setMinRating(0)}>×</button>
            </span>
                    )}
                    {availability !== 'Any Time' && (
                        <span className="filter-pill">
              {availability}
                            <button onClick={() => setAvailability('Any Time')}>×</button>
            </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchFilter;