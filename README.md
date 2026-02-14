# Banking Mobile

Expo (React Native) app with Clean Architecture: domain, data, presentation, shared, and a local mock API for development.

## Get started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the app with mocks (recommended in dev)**

   ```bash
   npm run dev
   ```

   This starts the **mock API** on `http://localhost:3099` and **Expo** together. In `__DEV__`, the app uses this URL automatically. Open the app (e.g. press `i` for iOS simulator).

3. **Run without mocks**

   ```bash
   npm start
   ```

   Set `EXPO_PUBLIC_USE_MOCKS=false` if you need to disable mocks while keeping `npm start`. The app will call `EXPO_PUBLIC_API_URL` (default `https://api.example.com`).

## Scripts

| Script          | Description                                      |
|-----------------|--------------------------------------------------|
| `npm run dev`   | Mock server + Expo (one terminal)                 |
| `npm start`     | Expo only                                        |
| `npm run mock:server` | Mock API only (port 3099)                  |
| `npm run typecheck`   | TypeScript check                           |
| `npm run lint`       | ESLint (Expo config)                        |

## Environment

| Variable                    | Purpose |
|----------------------------|--------|
| `EXPO_PUBLIC_USE_MOCKS`    | `true` / `false`. In `__DEV__`, mocks default **on** unless set to `false`. |
| `EXPO_PUBLIC_API_URL`      | API base URL. When mocks are on, default is `http://localhost:3099`. For a physical device, use your machine IP (e.g. `http://192.168.1.x:3099`). |
| `EXPO_PUBLIC_MOCK_AUTH`    | Set to `logged_in` to have `GET /auth/me` return 200 so the app opens on (tabs) instead of the welcome screen. |
| `EXPO_PUBLIC_LOG_LEVEL`    | `debug` \| `info` \| `warn` \| `error`. Default: `info` in dev, `warn` otherwise. |

## Project structure

- **`app/`** – Expo Router routes (`_layout.tsx`, `index` auth gate, `welcome`, `(tabs)`).
- **`src/`** – Application code (Clean Architecture). See [src/README.md](src/README.md) for the folder tree and layer roles.

High level: **domain** (entities, use cases, repository interfaces) → **data** (API client, repository implementations) → **presentation** (screens, components, hooks). **shared** holds config, theme, logger, and UI primitives. **src/core** provides DI (`getRepos`, `getUseCases`, `getAuthStatus`), providers, and navigation. **src/mocks** has MSW handlers for Node tests; the running app uses the local mock server from `scripts/mock-server.js`.

## Auth flow

- On launch, the app calls `GET /auth/me`. **401** → Welcome screen; **2xx** → (tabs).
- With the mock server, 401 is the default. Run with `EXPO_PUBLIC_MOCK_AUTH=logged_in npm run dev` to simulate logged in.

## Documentation

| Doc | Description |
|-----|-------------|
| [src/README.md](src/README.md) | Clean Architecture folder tree and layer responsibilities |
| [docs/msw-setup.md](docs/msw-setup.md) | MSW and mock-first setup (background; app currently uses local mock server) |
| [docs/migration-clean-architecture.md](docs/migration-clean-architecture.md) | Migration plan: Clean Architecture + mocks |
| [docs/refinement-clean-arch.md](docs/refinement-clean-arch.md) | Refinements and boundaries |
| [docs/migration-root-to-src.md](docs/migration-root-to-src.md) | Moving code into `src/` |
| [docs/refactor-fsd-to-clean-arch.md](docs/refactor-fsd-to-clean-arch.md) | Refactor from FSD to Clean Architecture |

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
