# Code Health Check Summary

Date: 2025-09-13

This repository was scanned via lint, type-check, build and unit tests. Raw outputs are saved under `reports`:

- `reports/lint.txt`
- `reports/type-check.txt`
- `reports/test.txt`
- `reports/build.txt`

## Overall Status

- Build fails during ESLint/type validation stage.
- TypeScript check reports multiple errors across source and tests.
- Jest tests: multiple suites failing (navigation, stats rendering, header, auth provider, resource card, etc.).
- ESLint/Prettier: many violations (formatting, unused vars, rules-of-hooks, no-console, etc.).

## Highlights by Area

### Build (Next.js)

- Compilation succeeds, but build is blocked by ESLint errors. See `reports/build.txt`.

### TypeScript

- Tests: attempting to set `process.env.NODE_ENV` (readonly), literal type mismatches (e.g., 'mobile' vs 'desktop').
- Source:
  - React Hooks rule: `src/components/ui/input.tsx` calls `React.useId` conditionally (must be unconditional).
  - Navigation & routing: usages of `window.location.href` break tests; prefer Next router `useRouter().push` and mock in tests.
  - Props type mismatches in actions/stats components (e.g., properties not defined on prop types).
  - `LazyImageOptions` referenced property does not exist (e.g., `preloadOnHover`).
  - Missing identifiers in `src/services/index.ts` (e.g., `articlesService`, `globalCache`).
  - `PerformanceWrapper` adds typings that conflict with DOM types (`requestIdleCallback`, `cancelIdleCallback`).
  - State inferred as `never[]` causing `setState` assignment errors — add explicit generics/initial values.

See `reports/type-check.txt` for exact lines.

### ESLint/Prettier

- Many Prettier formatting errors, including non-standard spaces and layout.
- Widespread unused imports/vars (e.g., `Metadata`, `Link`, skeletons, local vars).
- `no-console` warnings, `prefer-const`, `react/display-name`, `@typescript-eslint/no-explicit-any`.
- `<img>` vs `next/image` warnings.

See `reports/lint.txt` for full listing.

### Tests (Jest)

- Navigation tests fail due to jsdom not supporting real navigation; current code uses `window.location.href`.
- Stats/ResourceCard tests expect raw numbers and string icons, while components format numbers (e.g., `1,500`) and render SVG icons; key names differ (e.g., `views` vs `view`). Update tests or align components.
- Header test expects a menu item "设置" not present in implementation.
- AuthProvider tests sensitive to async state and error logs; act/waitFor usage may need adjustments.

See `reports/test.txt` for details.

## Recommended Fix Order

1. Auto-fix & formatting
   - Run: `npm run format` then `npm run lint:fix` to remove bulk Prettier/ESLint issues.
   - Manually remove unused imports/vars that auto-fix cannot resolve.

2. Critical rule fixes
   - Fix `src/components/ui/input.tsx` to call hooks unconditionally.

3. Type errors
   - Align component prop types and usage (actions/stats/resources/posts).
   - Replace direct `window.location.href` with `useRouter().push` and mock in tests.
   - Remove undefined props (e.g., `preloadOnHover` in `LazyImageOptions`).
   - Remove/replace missing identifiers in `src/services/index.ts`.
   - Avoid re-declaring DOM APIs in `PerformanceWrapper` typings.
   - Fix `never[]` state inference by adding explicit generics or non-empty initial values.

4. Tests alignment
   - Update tests to expect formatted numbers/SVGs or change components to expose raw values consistently.
   - Adjust Header test expectations to match actual menu items.
   - Wrap async React updates with `act`/`waitFor` where needed.

5. Re-verify
   - Re-run: `npm run type-check`, `npm run test`, `npm run build`.

## Optional Temporary Build Unblockers (not recommended long-term)

- In `next.config.js`: set `eslint.ignoreDuringBuilds = true`.
- In `next.config.js`: set `typescript.ignoreBuildErrors = true`.

These should be used only to unblock CI temporarily while fixing root causes.
