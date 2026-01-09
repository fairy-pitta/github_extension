import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../i18n/useLanguage';
import { ReviewState } from '@/domain/entities/Review';
import './styles/review-filter.css';

export type ReviewStatusFilterOption = ReviewState | 'ALL';

interface ReviewStatusFilterProps {
  selectedFilters: ReviewStatusFilterOption[];
  onChange: (filters: ReviewStatusFilterOption[]) => void;
  disabled?: boolean;
}

export const ReviewStatusFilter: React.FC<ReviewStatusFilterProps> = ({
  selectedFilters,
  onChange,
  disabled = false,
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const filterOptions: Array<{ value: ReviewStatusFilterOption; label: string }> = [
    { value: 'ALL', label: t.allReviews },
    { value: 'APPROVED', label: t.reviewApproved },
    { value: 'COMMENTED', label: t.reviewCommented },
    { value: 'CHANGES_REQUESTED', label: t.reviewChangesRequested },
    { value: 'REVIEW_REQUIRED', label: t.reviewRequiredOnly },
    { value: 'DISMISSED', label: t.reviewDismissed },
    { value: 'PENDING', label: t.reviewPending },
  ];

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const handleFilterToggle = useCallback(
    (value: ReviewStatusFilterOption) => {
      if (value === 'ALL') {
        onChange(['ALL']);
      } else {
        const newFilters = selectedFilters.includes(value)
          ? selectedFilters.filter((f) => f !== value && f !== 'ALL')
          : [...selectedFilters.filter((f) => f !== 'ALL'), value];
        onChange(newFilters.length === 0 ? ['ALL'] : newFilters);
      }
    },
    [selectedFilters, onChange]
  );

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const activeFilterCount = selectedFilters.filter((f) => f !== 'ALL').length;

  return (
    <div className="review-status-filter" ref={filterRef}>
      <button
        className={`review-filter-button ${isOpen ? 'active' : ''}`}
        onClick={handleToggle}
        disabled={disabled}
        aria-label={t.filterByReviewStatus}
        title={t.filterByReviewStatus}
      >
        <i className="fas fa-filter"></i>
        {activeFilterCount > 0 && (
          <span className="review-filter-badge">{activeFilterCount}</span>
        )}
      </button>
      {isOpen && (
        <div className="review-filter-menu">
          {filterOptions.map((option) => {
            const isSelected = selectedFilters.includes(option.value);
            return (
              <label
                key={option.value}
                className={`review-filter-option ${isSelected ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleFilterToggle(option.value)}
                  className="review-filter-checkbox"
                />
                <span className="review-filter-label">{option.label}</span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

