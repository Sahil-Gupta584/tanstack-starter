---
# GitHub Issue #3

**Repository**: Sahil-Gupta584/tanstack-starter
**Title**: bug improvements
**Author**: Sahil-Gupta584

## Description
- remove spreading of envs in env.ts , spsciyf each env explicilty to avoid overrides
- fix env example for incomeplte variabels according to env.ts
- verify envs on server start

---

## Developer Implementation Plan

### Issue Context
Improve environment variable handling by removing spreading in `env.ts`, updating `.env.example`, and adding server-start validation.

### Analysis & Findings
Found `src/env.ts` using `...import.meta.env` and `...process.env`. `.env.example` is incomplete. `src/db.ts` uses `process.env.DATABASE_URL` directly instead of the `env` object.

### Execution Steps
1. Modify `src/env.ts` to explicitly map `runtimeEnv` using `process.env` keys.
2. Update `.env.example` to include all variables defined in `src/env.ts`.
3. Add a validation check in a server entry point (e.g., `instrument.server.mjs` or similar) to ensure required envs are present.
4. Update `src/db.ts` to use `env.DATABASE_URL` instead of `process.env.DATABASE_URL`.
5. Verify changes by running a build or test command.
---
