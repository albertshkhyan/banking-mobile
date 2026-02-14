# Clean Architecture Refinement – Summary

## 1) Files moved

| From | To |
|------|----|
| src/data/mocks/handlers.ts | src/mocks/handlers.ts |
| src/data/mocks/server.ts | src/mocks/server.ts |
| src/data/mocks/browser.ts | src/mocks/browser.ts |

(Imports in handlers updated to `../data/dto/*` so mocks stay outside data layer.)

## 2) Files deleted

- src/presentation/context/repos-context.tsx
- src/presentation/context/use-cases-context.tsx
- src/data/mocks/* (after move to src/mocks)

## 3) Updated imports

- **bootstrap.ts:** `../data/mocks/server` → `../mocks/server`
- **data/index.ts:** removed exports of handlers, worker, server
- **mocks/handlers.ts:** DTOs from `../data/dto/account-dto` etc.
- **app/di/factory.ts:** no longer imports from presentation; exports `getRepos()` and `getUseCases()` singletons only
- **presentation/hooks/use-*-query.ts:** import `getRepos`, `getUseCases` from `../../app/di/factory`; no parameters
- **presentation/screens/home-screen.tsx, notification-screen.tsx:** removed useRepos/useUseCases; hooks take no args
- **app/providers/app-providers.tsx:** removed ReposProvider and UseCasesProvider; only QueryClientProvider
- **app/(tabs)/*.tsx:** thin wrappers; import screens from `@presentation/screens`, export `export default function Page() { return <XScreen />; }`

## 4) Dependency direction

- **domain:** no react, react-native, data, presentation, msw ✓
- **data:** no mocks; no presentation ✓
- **presentation:** imports app/di (getRepos, getUseCases) and domain types only; no direct data imports ✓
- **app:** wires data + domain; bootstrap imports mocks ✓
- **mocks:** import data DTOs only (dev infra); not imported by data ✓

## 5) Final folder tree (relevant parts)

```
src/
├── app/
│   ├── bootstrap.ts
│   ├── di/factory.ts    (getRepos, getUseCases)
│   ├── providers/
│   └── index.ts
├── data/                (no mocks)
│   ├── api/
│   ├── dto/
│   ├── mappers/
│   └── repositories/
├── domain/
├── mocks/               (MSW only)
│   ├── handlers.ts
│   ├── server.ts
│   ├── browser.ts
│   └── index.ts
├── presentation/
│   ├── components/
│   ├── hooks/           (use getRepos/getUseCases from app/di)
│   └── screens/
└── shared/
```

Root **app/(tabs)/** route files: only `export default function Page() { return <XScreen />; }`.

## 6) Why the architecture is cleaner

- **MSW in src/mocks:** Mocks are dev/test infrastructure, not part of the data layer. Data stays focused on repositories and API; mocks stay optional and don’t affect production wiring.
- **No repo/use-case context:** Repos and use cases are created once in app/di and exposed via `getRepos()`/`getUseCases()`. Hooks call these directly. No global React context, no provider tree, and app/di remains the single place that wires concrete implementations.
- **Thin route files:** Expo Router files under `/app` only render screens from `@presentation/screens`. All behavior and data live in presentation (and domain); routes are pure composition.
- **Clear boundaries:** Domain is framework-free; presentation depends only on domain and app/di; data has no reference to mocks; only app bootstrap pulls in mocks when needed.
