import React from 'react';
import './TutorCard.css';

const StarRating = ({ rating }) => {
  return (
    <div className="star-rating" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={star <= Math.round(rating) ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="1.5"
          className={star <= Math.round(rating) ? 'star-filled' : 'star-empty'}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="rating-value">{rating.toFixed(1)}</span>
    </div>
  );
};

const TutorCard = ({ tutor, onBook, onViewProfile }) => {
  const {
    id,
    name,
    avatar,
    subjects = [],
    rating = 0,
    reviewCount = 0,
    hourlyRate,
    bio,
    availability = [],
    sessionsCompleted = 0,
    isOnline = false,
  } = tutor;

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="tutor-card">
      {/* Avatar */}
      <div className="tutor-card__avatar-wrap">
        {avatar ? (
          <img src={avatar} alt={name} className="tutor-card__avatar" />
        ) : (
          <div className="tutor-card__avatar-fallback">{initials}</div>
        )}
        {isOnline && <span className="tutor-card__online-dot" aria-label="Online now" />}
      </div>

      {/* Info */}
      <div className="tutor-card__body">
        <div className="tutor-card__header">
          <h3 className="tutor-card__name">{name}</h3>
          <div className="tutor-card__price">
            <span className="price-amount">${hourlyRate}</span>
            <span className="price-unit">/hr</span>
          </div>
        </div>

        <StarRating rating={rating} />
        <p className="tutor-card__review-count">{reviewCount} reviews · {sessionsCompleted} sessions</p>

        {/* Subjects */}
        <div className="tutor-card__subjects">
          {subjects.slice(0, 4).map((s) => (
            <span key={s} className="subject-tag">{s}</span>
          ))}
          {subjects.length > 4 && (
            <span className="subject-tag subject-tag--more">+{subjects.length - 4}</span>
          )}
        </div>

        {/* Bio */}
        {bio && <p className="tutor-card__bio">{bio}</p>}

        {/* Availability */}
        {availability.length > 0 && (
          <div className="tutor-card__availability">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {availability.slice(0, 2).join(' · ')}
          </div>
        )}

        {/* Actions */}
        <div className="tutor-card__actions">
          <button
            className="btn-view-profile"
            onClick={() => onViewProfile?.(id)}
          >
            View Profile
          </button>
          <button
            className="btn-book"
            onClick={() => onBook?.(tutor)}
          >
            Book Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;
