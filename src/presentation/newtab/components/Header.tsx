import React from 'react';
import { RefreshButton } from '../../components/RefreshButton';
import { FilterToggle } from '../../components/FilterToggle';
import './header.css';

interface HeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
  filter: 'all' | 'open';
  onFilterChange: (filter: 'all' | 'open') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onRefresh,
  refreshing,
  filter,
  onFilterChange,
}) => {
  const openOptions = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <h1 className="dashboard-title">GitHub Dashboard</h1>
      </div>
      <div className="header-right">
        <FilterToggle value={filter} onChange={onFilterChange} disabled={refreshing} />
        <RefreshButton onClick={onRefresh} loading={refreshing} />
        <button onClick={openOptions} className="settings-button" aria-label="Settings">
          ⚙️
        </button>
      </div>
    </header>
  );
};


