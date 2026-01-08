# Phase 1: Domain Layer and Entity Definitions

## Purpose
Implement the domain layer of Clean Architecture and define entities and repository interfaces that represent GitHub data.

## Repository
GitHub Repository: https://github.com/fairy-pitta/github_extension.git

## Clean Architecture Layer

This phase focuses on the implementation of the **Domain layer**.

## Implementation Tasks

### 1. Entity Definitions
- [x] Create `src/domain/entities/PullRequest.ts`
  - number, title, state, url, updatedAt
  - repository (nameWithOwner)
  - reviewDecision, commentsCount
  - author, reviewers
- [x] Create `src/domain/entities/Issue.ts`
  - number, title, state, url, updatedAt
  - repository (nameWithOwner)
  - commentsCount
  - assignees, labels
- [x] Create `src/domain/entities/Repository.ts`
  - nameWithOwner, url, updatedAt
  - isPrivate, description
  - owner (personal/Org)
- [x] Create `src/domain/entities/User.ts`
  - login, name, avatarUrl
- [x] Create `src/domain/entities/Organization.ts`
  - login, name, avatarUrl
- [x] Create `src/domain/entities/index.ts` (exports)

### 2. Repository Interface Definitions
- [x] Create `src/domain/repositories/IPullRequestRepository.ts`
  - `getCreatedByMe(limit: number): Promise<PullRequest[]>`
  - `getReviewRequested(limit: number): Promise<PullRequest[]>`
  - `getReviewedByMe(limit: number): Promise<PullRequest[]>` (for future use)
- [x] Create `src/domain/repositories/IIssueRepository.ts`
  - `getInvolved(limit: number): Promise<Issue[]>`
- [x] Create `src/domain/repositories/IRepositoryRepository.ts`
  - `getRecentlyUpdated(limit: number, cursor?: string): Promise<{ repositories: Repository[], nextCursor?: string }>`
  - `getByOrganizations(orgLogins: string[], limit: number): Promise<Repository[]>`
- [x] Create `src/domain/repositories/IAuthRepository.ts`
  - `validateToken(token: string): Promise<User>`
  - `getCurrentUser(): Promise<User>`
- [x] Create `src/domain/repositories/index.ts` (exports)

### 3. Use Case Definitions
- [x] Create `src/domain/usecases/GetDashboardData.ts`
  - Integrated retrieval of PRs (created), PRs (review requested), Issues, and Repos
  - Receives repositories via dependency injection
- [x] Create `src/domain/usecases/ValidateToken.ts`
  - PAT validation
- [x] Create `src/domain/usecases/index.ts` (exports)

### 4. Domain Error Definitions
- [x] Create `src/domain/errors/DomainError.ts`
  - `AuthenticationError`
  - `RateLimitError`
  - `NetworkError`
  - `PermissionError`

## Test Items

### Unit Tests
- [x] Entity creation and validation tests
  - `PullRequest` entity tests
  - `Issue` entity tests
  - `Repository` entity tests
- [x] Use case tests (using mocked repositories)
  - `GetDashboardData` tests
  - `ValidateToken` tests
- [x] Domain error tests

### Test Files
- [x] `src/domain/entities/__tests__/PullRequest.test.ts`
- [x] `src/domain/entities/__tests__/Issue.test.ts`
- [x] `src/domain/entities/__tests__/Repository.test.ts`
- [x] `src/domain/usecases/__tests__/GetDashboardData.test.ts`
- [x] `src/domain/usecases/__tests__/ValidateToken.test.ts`

## Deliverables

- Domain entities (PR, Issue, Repository, User, Organization)
- Repository interfaces (Dependency Inversion Principle)
- Use cases (business logic)
- Domain error definitions

## GitHub Commit

```bash
git add .
git commit -m "feat: Phase 1 - Domain layer and entity definitions

- PullRequest, Issue, Repository, User, Organization entity definitions
- Repository interface definitions (IPullRequestRepository, IIssueRepository, etc.)
- Use case implementations (GetDashboardData, ValidateToken)
- Domain error definitions
- Unit tests for entities and use cases added"
```
