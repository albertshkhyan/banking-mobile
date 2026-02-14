# FSD → Clean Architecture Refactor

## Step A: Scan results

### Files under old FSD folders (before refactor)

| Location | Files |
|----------|--------|
| **src/entities/** | *(empty)* |
| src/entities/account/api/ | (no files) |
| src/entities/account/model/ | (no files) |
| src/entities/transaction/api/ | (no files) |
| src/entities/transaction/model/ | (no files) |
| **src/pages/** | *(empty)* |
| src/pages/home/ui/ | (no files) |
| **src/widgets/** | *(empty)* |
| src/widgets/balance-card/ui/ | (no files) |
| src/widgets/quick-actions/ui/ | (no files) |
| src/widgets/transaction-list/ui/ | (no files) |

**Import references:** None. No code in the repo imported from `src/entities`, `src/pages`, or `src/widgets` (only `domain/entities` and `presentation/screens` are used).

**Conclusion:** FSD folders were placeholder structure only; all real code already lives in Clean Architecture layers. No file moves required; only removal of empty FSD directories and alignment of folder tree to the target layout.

---

## Step B: Mapping plan (deterministic)

| Old (FSD) | New (Clean Arch) | Action |
|-----------|------------------|--------|
| src/pages/home/ui/* | src/presentation/screens/home-screen.tsx | Already exists; no move. |
| src/widgets/balance-card/ui/* | src/presentation/components/balance-card/* | No files; folder created for future. |
| src/widgets/quick-actions/ui/* | src/presentation/components/quick-actions/* | No files; folder created for future. |
| src/widgets/transaction-list/ui/* | src/presentation/components/transaction-list/* | No files; folder created for future. |
| src/entities/account/model/* | src/domain/entities/ (account.ts) | Already in domain; FSD was empty. |
| src/entities/account/api/* | src/data/api/, src/data/dto/ | Already in data; FSD was empty. |
| src/entities/transaction/model/* | src/domain/entities/ (transaction.ts) | Already in domain; FSD was empty. |
| src/entities/transaction/api/* | src/data/api/, src/data/dto/ | Already in data; FSD was empty. |
| — | src/shared/ui/ | Design system primitives only; folder created. |
| src/entities, src/pages, src/widgets | *(deleted)* | Remove entire trees. |

---

## Step C: Actions performed

1. **Removed** `src/entities`, `src/pages`, `src/widgets` (empty directories).
2. **Created** `src/presentation/components/` and `src/shared/ui/` with barrel files so the final tree matches the target Clean Architecture layout.
3. **Updated** `src/README.md` with the final folder tree.

---

## Verification checklist

- [x] **App boots** – Expo entry unchanged; no code imported from removed paths.
- [x] **Home screen renders** – Served by `app/(tabs)/index.tsx` using `@shared/ui` (ThemedText, ThemedView).
- [x] **Widgets** – No widget files existed in FSD; `presentation/components/` is ready for balance-card, quick-actions, transaction-list when you add them.
- [x] **Notifications screen** – `app/(tabs)/settings.tsx` and other tabs unchanged; `src/presentation/screens/notification-screen.tsx` exists for when you wire the app to use Clean Arch screens.
- [x] **TypeScript** – `npx tsc --noEmit` passes.
