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
Improve environment variable handling in src/env.ts by removing spreading, updating .env.example, and adding startup verification.

### Analysis & Findings
Codebase inspection of src/env.ts and .env.example confirms runtimeEnv uses broad spreading (`...import.meta.env, ...process.env`), .env.example is incomplete, and src/env.ts lacks startup verification.

### Execution Steps
1. Update src/env.ts to explicitly pass each required and optional server/client environment variable in runtimeEnv.
2. Add server startup environment verification check in src/env.ts or server entry points.
3. Update .env.example to list all variables defined in src/env.ts cleanly.
---
