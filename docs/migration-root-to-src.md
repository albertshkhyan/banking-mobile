# Migration: Root components/hooks/constants → src/ (Clean Architecture)

## Step A: File list and import references

### /components (9 files)
| File | Imported from |
|------|----------------|
| banking-tab-bar.tsx | app/(tabs)/_layout.tsx |
| button.tsx | (barrel only) |
| card.tsx | (barrel only) |
| divider-with-text.tsx | (barrel only) |
| gradient-view.tsx | (barrel only) |
| input.tsx | (barrel only) |
| themed-text.tsx | app/(tabs)/index, accounts, cards, settings; button, input, divider-with-text |
| themed-view.tsx | app/(tabs)/index, accounts, cards, settings; gradient-view |
| index.ts | barrel |

Internal: all components import from @/constants/theme and/or @/hooks/use-theme-color; banking-tab-bar also @/hooks/use-color-scheme.

### /hooks (3 files)
| File | Imported from |
|------|----------------|
| use-color-scheme.ts | app/_layout.tsx; use-theme-color.ts; banking-tab-bar.tsx |
| use-color-scheme.web.ts | (platform override) |
| use-theme-color.ts | themed-text, themed-view, button, input, card, divider-with-text, gradient-view |

Internal: use-theme-color imports @/constants/theme, @/hooks/use-color-scheme.

### /constants (1 file)
| File | Imported from |
|------|----------------|
| theme.ts | All component files; use-theme-color.ts; banking-tab-bar.tsx |

---

## Step B: Mapping (before → after)

| Before | After |
|--------|--------|
| constants/theme.ts | src/shared/config/theme.ts |
| hooks/use-color-scheme.ts | src/shared/hooks/use-color-scheme.ts |
| hooks/use-color-scheme.web.ts | src/shared/hooks/use-color-scheme.web.ts |
| hooks/use-theme-color.ts | src/shared/hooks/use-theme-color.ts |
| components/button.tsx | src/shared/ui/button.tsx |
| components/card.tsx | src/shared/ui/card.tsx |
| components/divider-with-text.tsx | src/shared/ui/divider-with-text.tsx |
| components/gradient-view.tsx | src/shared/ui/gradient-view.tsx |
| components/input.tsx | src/shared/ui/input.tsx |
| components/themed-text.tsx | src/shared/ui/themed-text.tsx |
| components/themed-view.tsx | src/shared/ui/themed-view.tsx |
| components/banking-tab-bar.tsx | src/app/navigation/banking-tab-bar.tsx |
| components/index.ts | replaced by src/shared/ui/index.ts (+ src/app/navigation/index.ts) |

---

## Step C & D: Execute moves, update imports, delete root folders.

Completed. Path aliases added: `@shared/*` → `./src/shared/*`, `@app/*` → `./src/app/*`. Expo 50+ resolves these via tsconfig. No references to `@/components`, `@/hooks`, `@/constants` remain in source; root folders deleted.
