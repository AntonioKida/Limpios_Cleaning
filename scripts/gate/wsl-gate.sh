#!/usr/bin/env bash
# scripts/gate/wsl-gate.sh <fast|full> <sha> <host_repo_upath>
#
# Runs INSIDE WSL (Ubuntu). The local CI gate moved off the VMware VM onto WSL, so this
# is the WSL analogue of the old SSH step in remote-gate.sh: it maintains an ISOLATED
# limpios gate clone on ext4 (fast) and runs scripts/ci-local.sh against the exact
# committed SHA being pushed — not the dirty working tree.
#
# Total isolation: this project owns ONLY ~/limpios-gate (+ its clone origin is the host
# working copy). It never reads or writes anything under ~/carbonell. Overridable via
# CI_LOCAL_GATE_DIR. Docs: docs/CI-LOCAL-WSL.md.
set -uo pipefail

MODE="${1:-fast}"
SHA="${2:?wsl-gate: sha required}"
HOST="${3:?wsl-gate: host repo path (a /mnt/... path) required}"
GATE_DIR="${CI_LOCAL_GATE_DIR:-$HOME/limpios-gate}"

# node/npm come from nvm in WSL (the VM used ~/.local/node); load it if present so the
# fast gate's native npm/build steps resolve a toolchain.
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1
export PATH="$HOME/.local/bin:$PATH"

# The host repo lives on /mnt/c (owned by the Windows user), which git flags as
# "dubious ownership" from WSL. It is our own repo, read as a clone source only.
safe_dir() { git config --global --get-all safe.directory 2>/dev/null | grep -qxF "$1" || git config --global --add safe.directory "$1"; }
safe_dir "$HOST"

if [ ! -d "$GATE_DIR/.git" ]; then
  echo "  (first run) creating the isolated WSL gate clone → $GATE_DIR"
  git clone -q "$HOST" "$GATE_DIR" || { echo "✗ gate clone failed" >&2; exit 1; }
fi
safe_dir "$GATE_DIR"

cd "$GATE_DIR" || { echo "✗ cannot cd $GATE_DIR" >&2; exit 2; }

# Pull the commit under test from the host working copy, pin the tree to it, and scrub
# any stray files (keeping node_modules/.next between runs so npm ci / build stay cheap).
git fetch -q "$HOST" || { echo "✗ fetch from host repo failed" >&2; exit 1; }
git checkout -q --detach "$SHA" 2>/dev/null || { echo "✗ commit $SHA not found in the gate clone after fetch" >&2; exit 1; }
git clean -qfd -e node_modules -e .next

exec bash scripts/ci-local.sh "$MODE"
