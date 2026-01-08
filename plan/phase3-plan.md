# Phase 3: Application Layer and Options Page Implementation

## Purpose
Implement application layer services and the Options page for PAT configuration.

## Repository
GitHub Repository: https://github.com/fairy-pitta/github_extension.git

## Clean Architecture Layer

This phase focuses on the implementation of the **Application layer** and **Presentation layer (Options)**.

## Implementation Tasks

### 1. Application Layer Service Implementation
- [x] Create `src/application/services/DashboardService.ts`
  - Uses `GetDashboardData` use case
  - Cache management (TTL checking)
  - Error handling and fallback (display cache)
- [x] Create `src/application/services/AuthService.ts`
  - Uses `ValidateToken` use case
  - PAT save/retrieve
  - Token validity checking
- [x] Create `src/application/services/RepositoryService.ts`
  - Business logic for Repo retrieval
  - Org Repo integration processing adjustments
- [x] Create `src/application/di/Container.ts` (dependency injection container)
  - Resolves dependencies for repositories and services
  - Singleton management

### 2. Options Page UI Implementation
- [x] Create `src/presentation/options/components/TokenInput.tsx`
  - PAT input field
  - Password-type display
  - Validation display
- [x] Create `src/presentation/options/components/SaveButton.tsx`
  - Save button
  - Loading state
- [x] Create `src/presentation/options/components/StatusMessage.tsx`
  - Success/error message display
- [x] Create `src/presentation/options/OptionsApp.tsx`
  - Main component for Options page
  - Form state management
  - Save processing
- [x] Update `src/presentation/options/index.tsx` (entry point)
  - Mount React app

### 3. Options Page Styling
- [x] Create `src/presentation/options/styles/options.css`
  - Modern UI design
  - Responsive support

### 4. Background Service Worker Implementation
- [x] Update `src/infrastructure/background/service-worker.ts`
  - Initialization on extension installation
  - Message handlers (as needed)
  - Storage change listeners

### 5. Configuration Management
- [x] Create `src/application/config/AppConfig.ts`
  - Cache TTL configuration
  - API endpoint configuration
  - Default value definitions

## Test Items

### Unit Tests
- [x] `DashboardService` tests
  - Cache hit tests
  - Cache miss API call tests
  - Error fallback tests
- [x] `AuthService` tests
  - PAT save/retrieve tests
  - Token validation tests
- [ ] `RepositoryService` tests
  - Org Repo integration tests
- [x] Options page component tests
  - `TokenInput` tests (input validation)
  - `OptionsApp` tests (save processing)

### Integration Tests
- [ ] Options page integration tests
  - PAT save → storage verification
  - Token validation → API call verification

### E2E Tests (Optional)
- [ ] Options page E2E tests
  - Form input → save → extension behavior verification

### Test Files
- [x] `src/application/services/__tests__/DashboardService.test.ts`
- [x] `src/application/services/__tests__/AuthService.test.ts`
- [ ] `src/application/services/__tests__/RepositoryService.test.ts`
- [x] `src/presentation/options/components/__tests__/TokenInput.test.tsx`
- [ ] `src/presentation/options/__tests__/OptionsApp.test.tsx`

## Deliverables

- Application layer services (DashboardService, AuthService, etc.)
- Options page (PAT input, save, validation)
- Dependency injection container
- Background Service Worker
- Configuration management

## GitHub Commit

```bash
git add .
git commit -m "feat: Phase 3 - Application layer and Options page implementation

- DashboardService, AuthService, RepositoryService implementations
- Dependency injection container implementation
- Options page UI implementation (PAT input, save, validation)
- Background Service Worker implementation
- Application layer and Options page unit tests added"
```
