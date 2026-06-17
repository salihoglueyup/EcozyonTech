---
name: preflight-commit
description: Run the project's four release gates and, only if all green, create one atomic commit with the project's trailer. Use when the user says "/preflight-commit" or asks to commit work the project way. User-invocable only (it commits — a side effect).
disable-model-invocation: true
---

# Preflight + commit (the Ecozyon way)

This project commits in **small atomic units**, and every commit must have all
gates green first. This skill encodes that ritual. It commits — never run it
without an explicit user request.

## 1. Gates (all must pass before committing)

Run, in order (or delegate to the `gate-runner` subagent to keep logs out of
context):

1. `npm run lint` — **0 errors**, ~12 warnings is the accepted baseline.
2. `npx vitest run` — all pass. The routing "404 page for an unknown path" test
   is **known-flaky** under full-suite load; if it's the only failure, re-run
   `npx vitest run -t "404"` in isolation before treating it as real.
3. `npm run build` — client + SSR + prerender (54 routes + OG cards).
4. `npm run bundle:check` — entry ≤ 48 kB, total < 500 kB, all `✓`.

If anything fails, STOP and report — do not commit.

## 2. Commit

- **Atomic**: one logical change per commit. If the working tree mixes unrelated
  changes, stage them separately (`git add -p` / per-path) into multiple commits.
- **Conventional-commit subject** matching the repo's history
  (`feat(scope): …`, `fix(scope): …`, `docs(scope): …`, `test(scope): …`,
  `refactor(scope): …`, `perf(scope): …`, `chore(scope): …`).
- **Multi-line message**: use a **Bash heredoc**, NOT a PowerShell here-string:

  ```bash
  git commit -F- <<'EOF'
  feat(scope): concise summary

  Optional body explaining the why.

  Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>
  EOF
  ```

- Every commit message **must end** with the trailer:
  `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`

## 3. Push (only if asked)

Push periodically when the user asks (`git push`). The project works on `main`
directly; if asked to branch first, branch before committing.

## Notes

- Leave `.claude/settings.local.json` as-is (it's tracked).
- After `git checkout HEAD -- <file>`, the file counts as modified — Read it
  before any further Edit.
- Revert local Playwright `@visual` baseline churn rather than committing it.
