# AGENTS.md — Opencode Minimal Loop

These rules are loaded by opencode before loop work.

## Loop Mode

- Start in L1 report-only mode.
- Read `STATE.md` before any triage.
- Update `STATE.md` after every loop run.
- Do not edit source code until the human explicitly enables L2.

## Safety

- Never push or merge without human approval.
- Never edit `.env`, `.env.*`, `auth/`, `payments/`, `secrets/`, or `credentials/`.
- Use a git worktree for every code-changing attempt.
- Max 3 fix attempts per item; escalate after that.

## Verification

- For L2+ changes, dispatch a verifier sub-agent after implementation.
- Run the project's documented tests before proposing a fix.
- Record test evidence in `STATE.md`.

## Deployment

- Never claim a change is "live", "deployed", or "available on production" unless you have verified:
  1. The git commit has been pushed to the remote (`git status` shows clean + `git log` matches remote).
  2. The production URL returns HTTP 200 (fetch or curl the actual URL).
- If changes only exist locally, say "ready to deploy" or "built locally" — never "live".

