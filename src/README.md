# Clean Architecture – Folder Tree

```
src/
├── core/                   # App composition, DI, bootstrap
│   ├── bootstrap.ts
│   ├── di/
│   │   └── factory.ts      # getRepos(), getUseCases(), getAuthStatus()
│   ├── navigation/        # Tab bar and nav UI
│   ├── providers/
│   │   └── app-providers.tsx
│   └── index.ts
├── data/                   # Repository implementations, API
│   ├── api/
│   ├── dto/
│   ├── mappers/
│   └── repositories/
├── domain/                 # Pure business logic, no framework
│   ├── entities/
│   ├── repositories/       # Interfaces only
│   └── use-cases/
├── mocks/                  # MSW handlers + server (Node tests only)
│   ├── handlers.ts
│   ├── server.ts           # msw/node for Jest/Vitest
│   └── index.ts
├── presentation/           # Screens, components, hooks
│   ├── components/
│   ├── hooks/
│   └── screens/
└── shared/                 # Config, lib, types, design primitives
    ├── config/             # env, theme
    ├── hooks/              # useColorScheme, useThemeColor
    ├── lib/                # queryClient, logger
    ├── types/              # Result, AppError
    └── ui/                 # Design system primitives (Button, Text, Card, etc.)
```

## Layer responsibilities

- **domain:** Entities, value objects, repository interfaces, use cases. No React/RN/Axios/TanStack/MSW.
- **data:** Implements repositories, DTOs, mappers, single API client. Normalizes errors to AppError. No mocks.
- **presentation:** Screens, TanStack Query hooks (repos/use cases from core/di). Dumb UI; no business logic.
- **shared:** Result/AppError, env config, queryClient, logger, design tokens.
- **core:** Providers, DI factory (getRepos/getUseCases/getAuthStatus), navigation; wires everything.
- **mocks:** MSW handlers + server for Node tests. The running app uses the local mock server (`npm run mock:server` / `npm run dev`); see root [README.md](../README.md).

## Mock-first

All API calls go through `createApiClient`. In `__DEV__`, mocks default on and the app uses `http://localhost:3099` (run `npm run dev` to start the mock server + Expo). See [docs/msw-setup.md](../docs/msw-setup.md) and [docs/migration-clean-architecture.md](../docs/migration-clean-architecture.md).
