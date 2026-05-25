package com.omar.yaladars.search;

/**
 * SearchCriteria — all filter parameters accepted by the Search & Filter component.
 * Maps directly to the frontend SearchFilter form fields.
 */
public class SearchCriteria {

    /** Free-text: matches tutor name, subjects, or bio */
    private String keyword;

    /** Filter by a specific subject (e.g. "Mathematics") */
    private String subject;

    /** Minimum hourly rate (inclusive). Null = no lower bound. */
    private Double minPrice;

    /** Maximum hourly rate (inclusive). Null = no upper bound. */
    private Double maxPrice;

    /** Minimum average rating (0.0 – 5.0). Null = no filter. */
    private Double minRating;

    /**
     * Availability filter — one of: "Weekdays", "Weekends", "Evenings", "Mornings".
     * Null = no filter.
     */
    private String availability;

    public SearchCriteria() {}

    public SearchCriteria(String keyword, String subject,
                          Double minPrice, Double maxPrice,
                          Double minRating, String availability) {
        this.keyword      = keyword;
        this.subject      = subject;
        this.minPrice     = minPrice;
        this.maxPrice     = maxPrice;
        this.minRating    = minRating;
        this.availability = availability;
    }

    public String getKeyword()           { return keyword; }
    public void   setKeyword(String k)   { this.keyword = k; }

    public String getSubject()           { return subject; }
    public void   setSubject(String s)   { this.subject = s; }

    public Double getMinPrice()          { return minPrice; }
    public void   setMinPrice(Double v)  { this.minPrice = v; }

    public Double getMaxPrice()          { return maxPrice; }
    public void   setMaxPrice(Double v)  { this.maxPrice = v; }

    public Double getMinRating()         { return minRating; }
    public void   setMinRating(Double v) { this.minRating = v; }

    public String getAvailability()           { return availability; }
    public void   setAvailability(String a)   { this.availability = a; }
}
