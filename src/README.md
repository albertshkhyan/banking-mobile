# Clean Architecture – Folder Tree

```
src/
├── app/                    # App composition, DI, bootstrap
│   ├── bootstrap.ts
│   ├── di/
│   │   └── factory.ts      # getRepos(), getUseCases()
│   ├── navigation/         # Tab bar and nav UI
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
├── mocks/                  # MSW (dev/test only; not data layer)
│   ├── handlers.ts
│   ├── server.ts
│   ├── browser.ts
│   └── index.ts
├── presentation/           # Screens, components, hooks
│   ├── components/
│   ├── hooks/
│   └── screens/
└── shared/                 # Config, lib, types, design primitives
    ├── config/             # env, theme
    ├── hooks/              # useColorScheme, useThemeColor
    ├── lib/                # queryClient
    ├── types/              # Result, AppError
    └── ui/                 # Design system primitives (Button, Text, Card, etc.)
```

## Layer responsibilities

- **domain:** Entities, value objects, repository interfaces, use cases. No React/RN/Axios/TanStack/MSW.
- **data:** Implements repositories, DTOs, mappers, single API client. Normalizes errors to AppError. No mocks.
- **presentation:** Screens, TanStack Query hooks (repos/use cases from app/di). Dumb UI; no business logic.
- **shared:** Result/AppError, env config, queryClient, design tokens.
- **app:** Providers, DI factory (getRepos/getUseCases), MSW bootstrap; wires everything.
- **mocks:** MSW handlers/server (dev only); not part of data layer.

## Mock-first

All API calls go through `createApiClient`. When `EXPO_PUBLIC_USE_MOCKS=true`, `bootstrap()` starts MSW server and UI works with mocks only. See `docs/msw-setup.md` and `docs/migration-clean-architecture.md`.
