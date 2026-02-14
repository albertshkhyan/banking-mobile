# Migration Plan: Clean Architecture + MSW Mock-First

## Step 1: Introduce new folder tree

- Add `src/` with layers: `domain/`, `data/`, `presentation/`, `shared/`, `app/`.
- Do not delete existing `app/`, `components/` yet; they remain until step 6.
- Install deps: `msw`, `@tanstack/react-query`.

## Step 2: Move entities to domain

- Place pure entities under `src/domain/entities/`: `account`, `transaction`, `notification`.
- Each entity is a TypeScript type/interface only (no React, no API).
- Remove or deprecate `entities/*/model` from the old structure once mapping is in place.

## Step 3: Create repository interfaces and use cases

- In `src/domain/repositories/`, define:
  - `AccountRepository`, `TransactionRepository`, `NotificationRepository`.
- In `src/domain/use-cases/`, add:
  - `GetAccounts`, `GetRecentTransactions`, `GetNotifications`.
- Use cases are functions that take a repository (and optional params) and return `Promise<Result<T>>`.

## Step 4: Implement mock repositories via MSW

- In `src/data/`: implement `AccountRepositoryImpl`, `TransactionRepositoryImpl`, `NotificationRepositoryImpl` using a single `ApiClient`.
- Add `src/data/api/api-client.ts` (baseURL from `EXPO_PUBLIC_API_URL`, error normalization to `AppError`).
- Add `src/mocks/handlers.ts` for `/accounts`, `/transactions`, `/notifications`.
- Add `src/mocks/server.ts` (Node) and `browser.ts` (web worker).
- In app entry, when `EXPO_PUBLIC_USE_MOCKS=true`, call `bootstrap()` to start MSW server so UI works 100% with mocks.

## Step 5: Replace UI data calls with use cases

- Add `src/app/di/factory.ts`: create API client, repos, and use cases.
- Add `src/app/providers/app-providers.tsx`: `QueryClientProvider`, `ReposProvider`, `UseCasesProvider`.
- In presentation, add:
  - `useAccountsQuery`, `useRecentTransactionsQuery`, `useNotificationsQuery` (TanStack Query; they call use cases + repos from context).
  - `HomeScreen` and `NotificationScreen` that use these hooks only (dumb UI).
- Wire `AppProviders` and optional `bootstrap()` into root layout.
- Replace any direct fetch/axios in old `pages/home` or widgets with the new hooks/screens.

## Step 6: Remove old entities/api structure

- Delete or archive `entities/*/api`, `entities/*/model` (old).
- Remove old `pages/home` and widgets that duplicated logic; keep only shared UI in `components/` or move reusable pieces to `presentation/` or `shared/ui`.
- Point Expo Router (or navigation) to new screens under `src/presentation/screens/` where applicable.

## Layer rules (reminder)

- **Domain:** No React, RN, Axios, TanStack Query, MSW. Only entities, repository interfaces, use cases, and shared types (Result, AppError).
- **Data:** Implements repositories, DTOs, mappers, API client, MSW handlers.
- **Presentation:** React/RN, TanStack Query, screens, hooks; depends only on domain interfaces and use cases (injected via context).
- **Shared:** Design system, utils, config, Result/AppError, queryClient.
- **App:** Providers, navigation wiring, DI factory, bootstrap.
