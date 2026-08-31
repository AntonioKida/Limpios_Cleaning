#!/usr/bin/env bash
# scripts/ci-local.sh [fast|full] — 2-level local CI gate, runs in WSL. Replaces GitHub-hosted CI
# (minutes exhausted). Limpios has NO database, so this is pure Node/Docker — no supabase, no test selector.
#
#   fast (~2-3 min, pre-push):  NATIVE parallel run of the `checks` job — placeholders ‖ typecheck ‖ lint ‖
#                               test ‖ build. No container overhead, no Playwright. Quick push-time sanity.
#   full (~6-8 min, pre-merge): BOTH GitHub jobs through `act` — `act -j checks` ‖ `act -j smoke` — a
#                               clean-room, node-20-in-container reproduction of the exact CI. Run via
#                               `npm run gate:full` before merging to main. (First run pulls a ~1GB image.)
#
# Sub-gates run in PARALLEL (background + wait, exit codes captured — ALL evaluated, not fail-fast, so every
# failure is reported). Fail-closed via the trap below. Escape: git push --no-verify. Docs: docs/CI-LOCAL-WSL.md.
set -uo pipefail
export PATH="$HOME/.local/node/bin:$HOME/.local/bin:$PATH"
cd "$(cd "$(dirname "$0")/.." && pwd)" || exit 2

MODE="${1:-full}"
# ci.yml's `pull_request`/`push` triggers are gone (moved to workflow_dispatch so GitHub spends no minutes);
# act drives the jobs via the workflow_dispatch event, which has no branch filter so both jobs always run.
ACT_EVENT=workflow_dispatch

# ── Integrity backstop (the gate must never report false-green) ─────────────────────────────────────────
# Each sub-gate captures its exit code and sets FAIL; the mode blocks `exit 1` explicitly on FAIL. This trap
# is the structural safety net: on ANY exit, if FAIL!=0 but the code is 0 (e.g. a trailing echo clobbered
# $?), force it to 1. So even a future refactor that adds a command after the decision can't make the gate
# lie green. Proven by scripts/gate/selftest.sh. NB: no `set -e` on purpose — sub-gates run in parallel and
# are ALL evaluated (`wait $P || FAIL=1`) to report every failure rather than aborting on the first.
FAIL=0
trap '__rc=$?; [ "${FAIL:-0}" -ne 0 ] && [ "$__rc" -eq 0 ] && __rc=1; exit "$__rc"' EXIT

# Fail-closed self-test hook: with CI_LOCAL_SELFTEST=1, simulate a failed sub-gate then `exit 0`; the trap
# MUST turn it into !=0. Runs BEFORE any setup so it touches nothing (used by selftest.sh on the host).
if [ "${CI_LOCAL_SELFTEST:-}" = "1" ]; then
  FAIL=1; echo "· selftest: simulated sub-gate FAILS → the gate must exit !=0 (despite the exit 0)"; exit 0
fi

# ── FAST GATE (native, no container) ────────────────────────────────────────────
if [ "$MODE" = "fast" ]; then
  echo "━━━━ FAST GATE · commit $(git rev-parse --short HEAD)"
  # HUSKY=0: don't let the repo's `prepare` script re-install git hooks inside this throwaway workdir.
  HUSKY=0 npm ci --no-audit --no-fund >/tmp/lg-install.log 2>&1 \
    || { echo "✗ npm ci"; tail -20 /tmp/lg-install.log; exit 1; }
  # The quick checks run in parallel. Only `typecheck` writes .next (its own `next typegen` — self-contained
  # and idempotent); placeholders/lint/test don't touch it, so there's no cross-write here.
  npm run check:placeholders >/tmp/lg-ph.log    2>&1 & P_PH=$!
  npm run typecheck          >/tmp/lg-tc.log    2>&1 & P_TC=$!   # = next typegen && tsc --noEmit
  npm run lint               >/tmp/lg-lint.log  2>&1 & P_LINT=$!
  npm run test               >/tmp/lg-test.log  2>&1 & P_TEST=$!
  FAIL=0
  wait $P_PH    || { FAIL=1; echo "✗ check:placeholders"; tail -20 /tmp/lg-ph.log; }
  wait $P_TC    || { FAIL=1; echo "✗ typecheck";          tail -30 /tmp/lg-tc.log; }
  wait $P_LINT  || { FAIL=1; echo "✗ lint";               tail -30 /tmp/lg-lint.log; }
  wait $P_TEST  || { FAIL=1; echo "✗ test";               tail -30 /tmp/lg-test.log; }
  # Build LAST and on its own: `next build` rewrites all of .next, so it must not run concurrently with
  # typecheck's tsc (which reads .next/types) — a race the sequential GitHub job never has. Skip it if a
  # cheaper check already failed (the push is blocked regardless).
  if [ $FAIL -eq 0 ]; then
    npm run build >/tmp/lg-build.log 2>&1 || { FAIL=1; echo "✗ build"; tail -30 /tmp/lg-build.log; }
  else
    echo "· build skipped (an earlier check already failed)"
  fi
  echo
  if [ $FAIL -eq 0 ]; then echo "✅ FAST GATE green. Push allowed."; exit 0; fi
  echo "❌ FAST GATE failed. Push aborted. (escape: git push --no-verify)"; exit 1
fi

# ── FULL GATE (act — faithful GitHub CI reproduction) ───────────────────────────
echo "━━━━ FULL GATE · commit $(git rev-parse --short HEAD) · act event=$ACT_EVENT"
act "$ACT_EVENT" -j checks --rm >/tmp/lg-checks.log 2>&1 & P_CHK=$!
act "$ACT_EVENT" -j smoke  --rm >/tmp/lg-smoke.log  2>&1 & P_SMK=$!
FAIL=0
wait $P_CHK || { FAIL=1; echo "✗ checks (act)"; tail -40 /tmp/lg-checks.log; }
wait $P_SMK || { FAIL=1; echo "✗ smoke (act)";  tail -40 /tmp/lg-smoke.log; }
echo
if [ $FAIL -eq 0 ]; then echo "✅ FULL GATE green."; exit 0; fi
echo "❌ FULL GATE failed."; exit 1
