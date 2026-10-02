CODEBASE OVERVIEW

This is "driz", a full-stack web application built with TanStack Start (React SSR). The stack is TypeScript throughout. Package manager is npm.

TECH STACK

Framework: TanStack Start (Vite + React 19)
Router: TanStack Router (file-based at src/routes/). Never edit src/routeTree.gen.ts manually. Run npm run generate-routes after adding/renaming routes.
Server API: oRPC with Zod validation (/api/rpc/* for RPC, /api/* for OpenAPI)
Database: Drizzle ORM + pg (PostgreSQL) with drizzle-kit. Schema at src/db/schema.ts (dynamic `pgSchema(getSchemaName())` reading `?schema=` from `DATABASE_URL` like Prisma did). Client `db` at src/db.ts (Pool `search_path` set from URL). Prisma removed.
Auth: better-auth (magic link + Google OAuth) via `drizzleAdapter(db, {provider:'pg'})`. Client instance: #/lib/auth-client.
Payments: Dodo Payments (hosted checkout redirect + webhook signature verification).
UI & Styling: shadcn/ui (Radix primitives) + Tailwind CSS v4. Icons: react-icons/ri.
Forms: react-hook-form + @hookform/resolvers/zod.

IMPORT ALIASES

Both #/* and @/* resolve to ./src/*. Prefer #/ for all internal imports.
Examples:
import { db } from '#/db'
import { env } from '#/env'

AGENT INSTRUCTIONS & KEY CONVENTIONS

1. Routing structure: Never create single dot-nested route files (e.g. settings.dashboard.tsx or dashboard.settings.tsx). Use flat directory-based nested routes under folders instead (e.g. src/routes/_protected/settings.tsx or src/routes/_protected/dashboard.tsx).
2. Auth in protected routes: Under _protected pages, do NOT call authClient.useSession() or getSession(). The user object is already provided in the page context by _protected.tsx. Access it via const { user } = Route.useRouteContext().
3. Forms: Any time a feature uses more than 2 input fields, always use react-hook-form with a proper Zod schema resolver (@hookform/resolvers/zod). Place the Zod schema at the top of the component file and infer the TypeScript type using z.infer<typeof schema>.
4. Env variables: Import env from '#/env' — never use process.env directly.
5. UI Components: All primitives live in src/components/ui/ (shadcn/ui). Import from '#/components/ui/*' — e.g. `import { Button } from '#/components/ui/button'`. Thin re-exports at src/components/Button.tsx etc. exist for backward compat only.
6. Route file modularization: Keep route files focused and concise. Do not overcrowd a single route file by declaring multiple sub-components inline. If a route file exceeds ~500 lines, convert it to a folder (e.g. rename dashboard.tsx to dashboard/index.tsx) and extract page-specific sub-components or utilities into a local subfolder (e.g. dashboard/-components/button.tsx).
7. Error handling & logging: Never swallow an error silently. Every caught error MUST `console.error` with a short identifying prefix (e.g. `[scan] failed for @user:`) plus the stack, so the cause is visible in the dev-server terminal. Never surface a bare "Internal server error" to the user: unwrap the oRPC error (`error.data?.message`) and show the actual reason, or an actionable fallback. When any error occurs that you did not cause, reproduce it in a throwaway script and get the real message BEFORE guessing at a fix — do not speculate.
8. No fluffy comments: The human reading this code has common sense. Do NOT write comments that restate what the code already says (`// increment the counter`, `// render the list`, `// loop over items`). Never explain the obvious, never narrate a step-by-step walkthrough of your own logic, never add a banner comment at the top of a file. Comment ONLY when something is genuinely non-obvious: a non-standard workaround, a subtle bug being worked around, a security/correctness constraint, or a "why this and not the obvious alternative". If a comment needs to explain the obvious, fix the code instead — usually a badly named function or variable is the real problem.
9. Name entities so they are self-explanatory: Assume the reader has never seen the domain and will not open the file to find out what something means. Name columns, types, functions, and variables for what they plainly are — `vibeScore`, `aiCommits`, `windowDays`, `avatarUrlFor()` — not `data`, `info`, `obj`, `result`, `temp`, `value`, or `helper`. Before adding a field, ask whether it could be derived from something already stored; if so, do not store it. A stored duplicate is a bug waiting to drift out of sync with its source. Prefer deriving at render time over persisting redundant data.

COMMANDS — ask before running any DB migration (never auto-push):

npm run generate-routes — Regenerate TanStack Router route tree
npm run db:generate — Generate Drizzle migrations (drizzle-kit generate) — ask first
npm run db:migrate — Apply Drizzle migrations (drizzle-kit migrate) — ask first
-never run dev server yourself
-never run build; use typecheck (`npx tsc --noEmit`) to verify
-do NOT run typecheck for small changes (copy, styling, one-off JSX tweaks) — it is slow and the user finds the wait irritating. Only typecheck when the change touches types, routes, server code, or spans several files.
-prefer answering first and editing directly; don't ask permission for routine edits

# db:push is prohibited — use migrate only
npm run build — Production build
npm run lint / npm run check — Run linter and typecheck