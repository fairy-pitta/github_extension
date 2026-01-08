import React from 'react';
import './styles/filter.css';

interface FilterToggleProps {
  value: 'all' | 'open';
  onChange: (value: 'all' | 'open') => void;
  disabled?: boolean;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="filter-toggle">
      <button
        onClick={() => onChange('all')}
        disabled={disabled}
        className={`filter-option ${value === 'all' ? 'active' : ''}`}
      >
        All
      </button>
      <button
        onClick={() => onChange('open')}
        disabled={disabled}
        className={`filter-option ${value === 'open' ? 'active' : ''}`}
      >
        Open Only
      </button>
    </div>
  );
};


