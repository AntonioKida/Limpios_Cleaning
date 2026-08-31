#!/usr/bin/env sh
# scripts/gate/remote-gate.sh [fast|full] [sha] — run the local CI gate in WSL from the host.
#
# The gate moved off the VMware VM onto WSL (Ubuntu). This validates the *committed* SHA
# being pushed (not the dirty working tree): it runs an integrity selftest on the host,
# then hands the SHA to scripts/gate/wsl-gate.sh inside WSL, which pins an isolated
# ~/limpios-gate clone to that commit and runs scripts/ci-local.sh <mode>. The WSL exit
# code propagates: on failure this exits !=0 and .husky/pre-push aborts the push.
#
# Total isolation: the WSL side owns ONLY ~/limpios-gate and never touches the Carbonell
# project that shares the box. Overridable via env: CI_LOCAL_WSL_DISTRO, CI_LOCAL_GATE_DIR.
# Docs: docs/CI-LOCAL-WSL.md.
set -u
# Stop MSYS/Git-Bash from rewriting the /mnt/... paths we hand to wsl.exe.
export MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL='*'

MODE="${1:-fast}"
SHA="${2:-$(git rev-parse HEAD)}"
WSL_DISTRO="${CI_LOCAL_WSL_DISTRO:-Ubuntu-22.04}"

echo "▶ Gate $MODE (WSL) · commit $(git rev-parse --short "$SHA")"

# 0) Integrity self-test BEFORE trusting the gate: proves on the host (<1s) that ci-local.sh is
#    fail-closed (a failed sub-gate ⇒ exit !=0, no false-green). A gate that can lie must not be used.
if ! sh "$(dirname "$0")/selftest.sh" >/dev/null 2>&1; then
  echo "✗ gate integrity selftest FAILED (the gate could report false-green) — aborted." >&2
  exit 1
fi

# 1) Resolve the host repo as WSL sees it (/mnt/c/...), then run the gate there.
TOP="$(git rev-parse --show-toplevel)"
UPATH="$(wsl.exe -d "$WSL_DISTRO" -- wslpath -u "$TOP" 2>/dev/null | tr -d '\r')"
if [ -z "$UPATH" ]; then
  echo "✗ could not resolve a WSL path for '$TOP' (is the '$WSL_DISTRO' distro running?)." >&2
  exit 1
fi

if wsl.exe -d "$WSL_DISTRO" -- bash -lc "bash '$UPATH/scripts/gate/wsl-gate.sh' '$MODE' '$SHA' '$UPATH'"; then
  exit 0
fi
echo "✗ Gate $MODE (WSL) FAILED. (escape: git push --no-verify)" >&2
exit 1
