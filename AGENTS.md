---
description: Project standards and tooling guidelines.
globs: "*.ts, *.tsx, *.html, *.css, *.js, *.jsx, package.json"
alwaysApply: false
---

Use Vite, React, TypeScript, and Vitest.

- Use standard package scripts (`npm run dev`, `npm run build`, `npm test`, etc.)
- Use Vitest (`vitest run`) for unit testing.
- Use Vite (`vite`) for dev server and bundling.

## Testing

Use Vitest to run tests:

```bash
npm test
```

```ts
import { describe, expect, test, vi } from "vitest";

describe("example", () => {
  test("works", () => {
    expect(1).toBe(1);
  });
});
```

## Frontend

The application is structured as a Vite React TypeScript project.
- Entry HTML: `/index.html` referencing `/src/main.tsx`
- React components and state live in `src/`
- Vite config: `vite.config.ts`

## Versioning

- Update the `version` field in `package.json` on every change (the footer in `src/App.tsx` reads `pkg.version` automatically) and add an entry to `src/datasheets/changelog.ts`.
- Bump the **patch** version (`x.y.Z`) on every change unless explicitly told the change is a feature, in which case bump the **minor** version (`x.Y.0`).
- Do not create git tags for versions.
