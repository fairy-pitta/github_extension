# Architecture Documentation

## Overview

This project follows **Clean Architecture** principles to ensure maintainability, testability, and separation of concerns. The architecture is divided into four main layers, each with distinct responsibilities.

## Architecture Layers

### 1. Domain Layer (`src/domain/`)

The innermost layer containing business logic and core entities. This layer has no dependencies on external frameworks or libraries.

#### Components:

- **Entities** (`entities/`): Core business objects
  - `User.ts`: User entity
  - `Organization.ts`: Organization entity
  - `Repository.ts`: Repository entity
  - `PullRequest.ts`: Pull Request entity
  - `Issue.ts`: Issue entity

- **Repository Interfaces** (`repositories/`): Abstract data access contracts
  - `IPullRequestRepository.ts`: Interface for PR data access
  - `IIssueRepository.ts`: Interface for Issue data access
  - `IRepositoryRepository.ts`: Interface for Repository data access
  - `IAuthRepository.ts`: Interface for authentication

- **Use Cases** (`usecases/`): Business logic orchestration
  - `GetDashboardData.ts`: Fetches all dashboard data
  - `ValidateToken.ts`: Validates GitHub PAT

- **Errors** (`errors/`): Domain-specific error classes
  - `DomainError.ts`: Base error class and derived errors

#### Principles:

- No dependencies on external frameworks
- Pure business logic
- Entities are plain TypeScript classes
- Repository interfaces define contracts (Dependency Inversion Principle)

### 2. Application Layer (`src/application/`)

Orchestrates use cases and manages application-specific logic. This layer depends on the Domain layer.

#### Components:

- **Services** (`services/`): Application services
  - `AuthService.ts`: Handles authentication flow
  - `DashboardService.ts`: Orchestrates dashboard data retrieval with caching
  - `RepositoryService.ts`: Repository-specific operations

- **Dependency Injection** (`di/`): DI container
  - `Container.ts`: Manages service and repository instances

- **Configuration** (`config/`): Application configuration
  - `AppConfig.ts`: Centralized configuration (cache TTL, defaults)

#### Responsibilities:

- Orchestrates use cases
- Manages caching strategy
- Handles application-level concerns
- Provides dependency injection

### 3. Infrastructure Layer (`src/infrastructure/`)

Implements external dependencies and adapters. This layer depends on both Domain and Application layers.

#### Components:

- **API Clients** (`api/`): GitHub API integration
  - `GitHubGraphQLClient.ts`: GraphQL API client
  - `GitHubRESTClient.ts`: REST API client
  - `queries/*.graphql`: GraphQL query definitions
  - `mappers/*.ts`: Converts API responses to domain entities

- **Storage** (`storage/`): Chrome Storage wrapper
  - `IStorage.ts`: Storage interface
  - `ChromeStorage.ts`: Chrome Storage implementation
  - `StorageKeys.ts`: Storage key constants

- **Cache** (`cache/`): Caching implementation
  - `ICache.ts`: Cache interface
  - `MemoryCache.ts`: In-memory cache with TTL
  - `CacheKeys.ts`: Cache key constants

- **Repositories** (`repositories/`): Concrete repository implementations
  - `PullRequestRepository.ts`: PR repository implementation
  - `IssueRepository.ts`: Issue repository implementation
  - `RepositoryRepository.ts`: Repository repository implementation
  - `AuthRepository.ts`: Authentication repository implementation

- **Background** (`background/`): Service worker
  - `service-worker.ts`: Chrome extension service worker

#### Responsibilities:

- Implements repository interfaces from Domain layer
- Handles external API communication
- Manages storage and caching
- Converts external data formats to domain entities

### 4. Presentation Layer (`src/presentation/`)

UI components and user interaction. This layer depends on Application and Infrastructure layers.

#### Components:

- **Dashboard Page** (`dashboard/`): Main dashboard displayed on GitHub.com
  - `DashboardApp.tsx`: Main app component
  - `hooks/`: React hooks for data fetching
  - `components/`: Page-specific components
  - `styles/`: Page-specific styles

- **Options Page** (`options/`): Settings page
  - `OptionsApp.tsx`: Options page component
  - `components/`: Options page components
  - `styles/`: Options page styles

- **Shared Components** (`components/`): Reusable UI components
  - `PRCard.tsx`, `IssueCard.tsx`, `RepositoryCard.tsx`: Card components
  - `LoadingSpinner.tsx`, `ErrorMessage.tsx`: Utility components
  - `ErrorBoundary.tsx`: Error boundary component
  - `SkeletonLoader.tsx`: Loading skeleton component

- **Utils** (`utils/`): Presentation utilities
  - `dateUtils.ts`: Date formatting utilities

#### Responsibilities:

- Renders UI
- Handles user interactions
- Manages component state
- Displays data from Application layer

## Data Flow

```
User Action
    ↓
Presentation Layer (React Components)
    ↓
Application Layer (Services)
    ↓
Domain Layer (Use Cases)
    ↓
Infrastructure Layer (Repositories)
    ↓
External APIs / Storage
```

### Example: Fetching Dashboard Data

1. **User opens GitHub.com** → Content script injects dashboard → `DashboardApp.tsx` renders
2. **Hook fetches data** → `useDashboardData` calls `DashboardService`
3. **Service checks cache** → `DashboardService.getDashboardData()` checks cache first
4. **Use case executes** → `GetDashboardData.execute()` orchestrates repository calls
5. **Repositories fetch data** → `PullRequestRepository`, `IssueRepository`, etc. call GitHub API
6. **API clients make requests** → `GitHubGraphQLClient` / `GitHubRESTClient` make HTTP requests
7. **Mappers convert data** → API responses converted to domain entities
8. **Data flows back** → Entities → Use Case → Service → Hook → Component
9. **UI updates** → React components re-render with new data

## Dependency Rules

1. **Domain Layer**: No dependencies (innermost layer)
2. **Application Layer**: Depends only on Domain layer
3. **Infrastructure Layer**: Depends on Domain layer (implements interfaces)
4. **Presentation Layer**: Depends on Application and Infrastructure layers

## Key Design Patterns

### 1. Dependency Inversion Principle (DIP)

Repository interfaces are defined in the Domain layer, but implementations are in the Infrastructure layer. This allows the Domain layer to remain independent of external dependencies.

### 2. Dependency Injection (DI)

The `Container` class manages all dependencies and provides instances to components. This makes the code testable and maintainable.

### 3. Repository Pattern

Data access is abstracted through repository interfaces, allowing easy swapping of implementations (e.g., API → mock for testing).

### 4. Use Case Pattern

Business logic is encapsulated in use cases, making it easy to understand and test application workflows.

## Testing Strategy

- **Domain Layer**: Unit tests for entities and use cases (mocked repositories)
- **Application Layer**: Unit tests for services (mocked repositories and cache)
- **Infrastructure Layer**: Unit tests for API clients, storage, cache (mocked HTTP/storage)
- **Presentation Layer**: Component tests with React Testing Library

## Performance Optimizations

1. **Code Splitting**: Lazy loading of section components using `React.lazy`
2. **Memoization**: `React.memo`, `useMemo`, `useCallback` to prevent unnecessary re-renders
3. **Caching**: TTL-based caching to reduce API calls
4. **Parallel Requests**: `Promise.all` for concurrent API calls

## Error Handling

- **Domain Errors**: Custom error classes for different error types
- **Error Boundary**: Catches React component errors
- **Error Messages**: User-friendly error messages with suggestions
- **Fallback**: Cached data used as fallback on network errors

## Future Enhancements

- OAuth authentication (currently PAT-based)
- Real-time updates via WebSockets
- Customizable dashboard layout
- Dark mode support
- More granular caching per section



