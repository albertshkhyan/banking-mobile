# SVG Icons

Icons are SVG files imported as React components via `react-native-svg-transformer`.

## Usage

```tsx
import BankBuilding from '../../assets/icons/bank-building.svg';

// Default size (viewBox 48x48)
<BankBuilding />

// Custom size and color (uses currentColor in SVG)
<BankBuilding width={32} height={32} color="#1E3A5F" />
```

Use `color` to theme; the SVG uses `stroke="currentColor"` so it inherits the tint.

## Adding icons

1. Add a new `.svg` in this folder.
2. Prefer `currentColor` for stroke/fill so the icon can be themed with the `color` prop.
3. Import directly: `import MyIcon from '@/assets/icons/my-icon.svg'` (if `@/` points at project root).

## Setup

- **Metro:** `metro.config.js` uses `react-native-svg-transformer/expo` so `.svg` is treated as a component.
- **TypeScript:** `svg.d.ts` declares `*.svg` as `React.FC<SvgProps>`.
