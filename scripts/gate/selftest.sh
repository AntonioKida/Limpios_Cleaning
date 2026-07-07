#!/usr/bin/env sh
# scripts/gate/selftest.sh — integrity regression guard for the gate.
#
# Proves scripts/ci-local.sh is FAIL-CLOSED: if a sub-gate fails, the gate MUST exit !=0 even if the exit
# path tries to report green (a trailing echo / exit 0). Uses the CI_LOCAL_SELFTEST=1 hook, which marks
# FAIL=1 and `exit 0` on purpose BEFORE any setup (touches nothing) — the gate's trap backstop must convert
# that into !=0. Runs on the host in <1s; it's the lock that stops a future refactor from reintroducing a
# gate that lies green. Wired as `npm run gate:selftest` and run first by remote-gate.sh. Docs: docs/CI-LOCAL-VM.md.
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

fail() { echo "❌ SELFTEST FAILED: $1"; exit 1; }

# 1) FAIL-CLOSED: a simulated failed sub-gate must NOT let the gate exit 0.
CI_LOCAL_SELFTEST=1 bash "$ROOT/scripts/ci-local.sh" fast >/dev/null 2>&1
rc=$?
[ "$rc" -ne 0 ] || fail "the gate exited 0 despite a failed sub-gate (fail-OPEN: the gate lies)"
echo "✓ fail-closed: failed sub-gate → gate exit $rc (!=0)"

# 2) Sanity: the hook is opt-in — without CI_LOCAL_SELFTEST set it must not force red by itself.
grep -q 'CI_LOCAL_SELFTEST:-' "$ROOT/scripts/ci-local.sh" || fail "the selftest hook is not gated by CI_LOCAL_SELFTEST"
echo "✓ hook opt-in: the selftest only activates with CI_LOCAL_SELFTEST=1"

echo "✅ SELFTEST OK — the gate is fail-closed (cannot report green with a pending failure)."
