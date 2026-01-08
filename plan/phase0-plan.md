# Phase 0: Project Initialization and Architecture Design

## Purpose
Establish the basic project structure and build a development environment based on Clean Architecture principles.

## Repository
GitHub Repository: https://github.com/fairy-pitta/github_extension.git

## Clean Architecture Layer Structure

```
src/
├── domain/              # Domain layer (business logic, entities)
│   ├── entities/        # Entities (PR, Issue, Repository, User, etc.)
│   ├── repositories/    # Repository interfaces
│   └── usecases/       # Use cases (business logic)
├── application/         # Application layer (interface implementation)
│   ├── services/       # Service implementations
│   └── mappers/        # Data mappers (API response → Entity)
├── infrastructure/      # Infrastructure layer (external dependencies)
│   ├── api/            # GitHub API client
│   ├── storage/        # Chrome Storage implementation
│   └── cache/          # Cache implementation
└── presentation/        # Presentation layer (UI)
    ├── newtab/         # New Tab page
    ├── options/        # Options page
    └── components/     # Shared components
```

## Implementation Tasks

### 1. Project Basic Configuration
- [ ] Create `package.json`
  - TypeScript, React, React DOM
  - Build tool (Vite recommended)
  - Test framework (Vitest + React Testing Library)
  - Linter (ESLint + Prettier)
- [ ] Create `tsconfig.json`
  - Strict type checking configuration
  - Path alias configuration (`@/domain`, `@/application`, etc.)
- [ ] Create `vite.config.ts`
  - Chrome extension build configuration
  - Multi-entry point configuration (newtab, options, background)

### 2. Manifest V3 Configuration
- [ ] Create `manifest.json`
  - Manifest V3 format
  - New Tab override configuration
  - Permission settings (storage, host_permissions for api.github.com)
  - Service Worker configuration
  - Icon path configuration

### 3. Directory Structure Creation
- [ ] Create all directories based on Clean Architecture
- [ ] Create `index.ts` files for each layer (for exports)

### 4. Basic HTML Files
- [ ] Create `src/presentation/newtab/index.html`
- [ ] Create `src/presentation/options/index.html`

### 5. Entry Points Creation
- [ ] Create `src/presentation/newtab/index.tsx`
- [ ] Create `src/presentation/options/index.tsx`
- [ ] Create `src/infrastructure/background/service-worker.ts`

### 6. Development Environment Configuration
- [ ] Create `.gitignore`
- [ ] Create `.eslintrc.json`
- [ ] Create `.prettierrc`
- [ ] Create `README.md` (project overview, setup instructions)

## Test Items

### Unit Tests
- [ ] Build configuration tests (verify each entry point builds correctly)
- [ ] TypeScript type checking tests
- [ ] Linter tests

### Integration Tests
- [ ] Manifest V3 validation tests
- [ ] Extension load tests (verify it loads as a Chrome extension)

## Deliverables

- Basic project structure
- Build environment (development/production)
- Clean Architecture-based directory structure
- Development environment (TypeScript, React, test environment)

## GitHub Commit

```bash
git add .
git commit -m "feat: Phase 0 - Project initialization and Clean Architecture structure

- Manifest V3 configuration
- TypeScript + React + Vite environment setup
- Clean Architecture-based directory structure creation
- Build configuration and development environment setup
- Test framework (Vitest) introduction"
```
