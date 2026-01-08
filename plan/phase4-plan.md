# Phase 4: New Tab Page UI Implementation

## Purpose
Implement the New Tab page UI and display PR, Issue, and Repository sections.

## Repository
GitHub Repository: https://github.com/fairy-pitta/github_extension.git

## Clean Architecture Layer

This phase focuses on the implementation of the **Presentation layer (New Tab)**.

## Implementation Tasks

### 1. New Tab Page Basic Structure
- [x] Create `src/presentation/newtab/NewTabApp.tsx`
  - Main app component
  - State management (loading, error, data)
  - Refresh functionality
- [x] Create `src/presentation/newtab/hooks/useDashboardData.ts`
  - Data retrieval using DashboardService
  - Cache management
  - Error handling
- [x] Create `src/presentation/newtab/hooks/useAuth.ts`
  - Authentication state management
  - PAT retrieval and validation

### 2. Shared Components
- [x] Create `src/presentation/components/LoadingSpinner.tsx`
  - Loading display
- [x] Create `src/presentation/components/ErrorMessage.tsx`
  - Error message display
  - Retry button
- [x] Create `src/presentation/components/RefreshButton.tsx`
  - Refresh button
- [x] Create `src/presentation/components/FilterToggle.tsx`
  - Filter toggle (All / Open Only)

### 3. PR Section Implementation
- [x] Create `src/presentation/components/PRSection.tsx`
  - PR list display
  - Title, state, updated timestamp
  - Repository name display
- [x] Create `src/presentation/components/PRCard.tsx`
  - Individual PR card
  - State badge (Open, Closed, Draft, etc.)
  - Opens GitHub page on click
- [x] Create `src/presentation/components/CreatedPRSection.tsx`
  - "PRs Created by Me" section
- [x] Create `src/presentation/components/ReviewRequestedPRSection.tsx`
  - "PRs with Review Requested" section

### 4. Issue Section Implementation
- [x] Create `src/presentation/components/IssueSection.tsx`
  - Issue list display
- [x] Create `src/presentation/components/IssueCard.tsx`
  - Individual Issue card
  - State badge
  - Label display (optional)

### 5. Repository Section Implementation
- [x] Create `src/presentation/components/RepositorySection.tsx`
  - Repository list display
  - Pagination support
- [x] Create `src/presentation/components/RepositoryCard.tsx`
  - Individual Repository card
  - Updated timestamp display
  - Private/public display
- [x] Create `src/presentation/components/LoadMoreButton.tsx`
  - "Load More" button
  - Pagination processing

### 6. Layout Implementation
- [x] Create `src/presentation/newtab/components/DashboardLayout.tsx`
  - Grid layout
  - Section placement
- [x] Create `src/presentation/newtab/components/Header.tsx`
  - Title
  - Refresh button
  - Filter toggle
  - Settings link

### 7. Styling
- [x] Create `src/presentation/newtab/styles/newtab.css`
  - Modern UI design
  - Responsive support
  - Dark mode support (optional)
- [x] Create `src/presentation/components/styles/cards.css`
  - Card component styles

### 8. Authentication Check
- [x] Create `src/presentation/newtab/components/AuthGuard.tsx`
  - Display when PAT is not set
  - Link to Options page

## Test Items

### Unit Tests
- [x] `useDashboardData` hook tests
  - Data retrieval tests
  - Cache usage tests
  - Error handling tests
- [x] `useAuth` hook tests
  - Authentication state tests
- [ ] Section component tests
  - `CreatedPRSection` tests
  - `ReviewRequestedPRSection` tests
  - `IssueSection` tests
  - `RepositorySection` tests (pagination)
- [x] Card component tests
  - `PRCard` tests
  - `IssueCard` tests
  - `RepositoryCard` tests

### Integration Tests
- [ ] New Tab page integration tests
  - Data retrieval → display verification
  - Filter toggle tests
  - Pagination tests
  - Refresh tests

### Test Files
- [x] `src/presentation/newtab/hooks/__tests__/useDashboardData.test.ts`
- [x] `src/presentation/newtab/hooks/__tests__/useAuth.test.ts`
- [ ] `src/presentation/components/__tests__/PRSection.test.tsx`
- [ ] `src/presentation/components/__tests__/IssueSection.test.tsx`
- [ ] `src/presentation/components/__tests__/RepositorySection.test.tsx`
- [ ] `src/presentation/newtab/__tests__/NewTabApp.test.tsx`

## Deliverables

- New Tab page UI (PR, Issue, Repository sections)
- Shared components (Loading, Error, Cards, etc.)
- Pagination functionality
- Filter functionality (All / Open Only)
- Refresh functionality
- Authentication guard

## GitHub Commit

```bash
git add .
git commit -m "feat: Phase 4 - New Tab page UI implementation

- New Tab page main UI implementation
- PR sections (created/review requested) implementation
- Issue section implementation
- Repository section implementation (pagination support)
- Shared components (Loading, Error, Cards) implementation
- Filter functionality (All / Open Only) implementation
- Refresh functionality implementation
- Authentication guard implementation
- New Tab page unit tests and integration tests added"
```
