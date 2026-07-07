#!/usr/bin/env sh
# scripts/gate/remote-gate.sh [fast|full] [sha] — run the local CI gate on the VM from the host.
#
# Ships the *committed* HEAD to the VM (its own bare mirror), then runs `scripts/ci-local.sh <mode>`
# there over SSH. The VM's exit code propagates: if the gate fails this exits !=0, and `.husky/pre-push`
# aborts the push. It validates exactly what you're about to publish, not your dirty working tree.
#
# Total isolation: this project owns ~/limpios-gate(.git) on the VM and never touches the Carbonell
# project that shares the box. Overridable via env: CI_LOCAL_VM_SSH, CI_LOCAL_GATE_REMOTE, CI_LOCAL_GATE_DIR.
set -u
MODE="${1:-fast}"
SHA="${2:-$(git rev-parse HEAD)}"
VM_SSH="${CI_LOCAL_VM_SSH:-kida@192.168.246.129}"
GATE_REMOTE="${CI_LOCAL_GATE_REMOTE:-vm-gate}"
GATE_DIR="${CI_LOCAL_GATE_DIR:-limpios-gate}"
GATE_BRANCH=gate

echo "▶ Gate $MODE (VM) · commit $(git rev-parse --short "$SHA")"

# 0) Integrity self-test BEFORE trusting the gate: proves on the host (<1s) that ci-local.sh is
#    fail-closed (a failed sub-gate ⇒ exit !=0, no false-green). A gate that can lie must not be used.
if ! sh "$(dirname "$0")/selftest.sh" >/dev/null 2>&1; then
  echo "✗ gate integrity selftest FAILED (the gate could report false-green) — aborted." >&2
  exit 1
fi

# 1) Sync the commit to the VM (--no-verify: this internal push must NOT re-trigger the pre-push hook).
if ! git push --no-verify --force "$GATE_REMOTE" "$SHA:refs/heads/$GATE_BRANCH"; then
  echo "✗ could not sync the commit to the VM (remote '$GATE_REMOTE')." >&2
  exit 1
fi

# 2) On the VM: pin the workdir to the commit and run the gate in the requested mode. `git clean` keeps
#    node_modules/.next between runs (cheaper); npm ci still refreshes deps on the fast path.
if ssh "$VM_SSH" "cd ~/$GATE_DIR && git fetch -q origin && git reset -q --hard origin/$GATE_BRANCH && git clean -qfd -e node_modules -e .next && bash scripts/ci-local.sh $MODE"; then
  exit 0
fi
echo "✗ Gate $MODE (VM) FAILED. (escape: git push --no-verify)" >&2
exit 1
