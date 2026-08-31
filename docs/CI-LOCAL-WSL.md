# Local CI in WSL (`act`)

GitHub-hosted Actions minutes are exhausted, so CI runs locally in **WSL** (Ubuntu)
instead. The **same** `.github/workflows/ci.yml` is the source of truth — it's just
executed locally by [`act`](https://github.com/nektos/act) (which runs GitHub
Actions workflows in Docker) plus a fast native pass, wired to `git push` via a
`.husky/pre-push` hook.

Nothing about the app changed. If GitHub minutes ever return, re-enable the
workflow's `push`/`pull_request` triggers (see the comment at the top of `ci.yml`).
To stop gating pushes locally, remove `.husky/pre-push`.

> This replaced an earlier VMware-VM gate. The VM is gone; everything now runs in
> WSL on the same machine, which is faster (no SSH, ext4 not a 9p mount) and has no
> VM to power on.

## Two levels

| Level | When | Runs | Time | How |
|---|---|---|---|---|
| **fast** | every `git push` (pre-push hook) | `checks` job, **natively**: placeholders ‖ typecheck ‖ lint ‖ test ‖ build | ~2–3 min | `npm run gate:fast` |
| **full** | before merging to `main` | **both** jobs via `act`: `checks` ‖ `smoke` (Playwright), node-20-in-container | ~6–8 min (first run pulls a ~1 GB image) | `npm run gate:full` |

- **fast** is native (no Docker) for speed — a quick "is this push sane?" check. It
  uses WSL's Node 22, so it's a close-but-not-identical stand-in.
- **full** is the authoritative reproduction: `act` runs the exact workflow steps in
  the `catthehacker/ubuntu:act-latest` container on Node 20, including the Playwright
  smoke job. Run it before you merge.

Both are **fail-closed** (see "Integrity" below). Escape hatch for emergencies:
`git push --no-verify` skips the hook entirely.

## Architecture

```
host (Windows, Git Bash)                WSL (Ubuntu-22.04)
────────────────────────                ──────────────────
git push origin …
  └─ .husky/pre-push
       └─ scripts/gate/remote-gate.sh fast <sha>
            1. selftest.sh        (host, <1s — proves the gate can't lie green)
            2. wslpath -u <repo>  (resolve /mnt/c/… path)
            3. wsl.exe … bash ───►  scripts/gate/wsl-gate.sh fast <sha> <mnt-path>
                                        ├─ clone (first run) / fetch  ~/limpios-gate
                                        ├─ git checkout --detach <sha>
                                        └─ bash scripts/ci-local.sh fast
       exit ≠ 0  ⇒  push aborted
```

- No SSH and no bare-mirror remote any more: the host repo is visible to WSL at
  `/mnt/c/…`, so `wsl-gate.sh` clones/fetches from it directly into an isolated
  ext4 workdir and pins it to the exact commit being pushed.
- It gates the **committed** SHA (what you're publishing), not your dirty tree.
- Overridable via env: `CI_LOCAL_WSL_DISTRO` (default `Ubuntu-22.04`),
  `CI_LOCAL_GATE_DIR` (default `~/limpios-gate`).

### Total isolation from the Carbonell project

WSL also hosts an unrelated project at `~/carbonell`. This gate lives entirely in its
own path and **never touches** anything named `carbonell`:

- Owns: `~/limpios-gate` (the isolated clone; its `origin` is the host working copy).
- Reuses only the shared read-only toolchain (`node` via nvm, `act` under `~/.local`).
- Limpios has **no database**, so there are none of Carbonell's Supabase containers,
  ports, or `project_id` collisions to worry about — the two never intersect.

## Integrity — the gate cannot report false-green

`scripts/ci-local.sh` runs its sub-gates in parallel and evaluates **all** of them
(`wait $PID || FAIL=1`), then exits `1` if any failed. A `trap … EXIT` backstop forces
a non-zero exit if `FAIL` is set even when `$?` was clobbered by a trailing command.

`scripts/gate/selftest.sh` proves this every time (it runs first, on the host, in
<1 s): it invokes the gate with `CI_LOCAL_SELFTEST=1`, which simulates a failed
sub-gate and then deliberately `exit 0`s — the trap must convert that to non-zero. If
the selftest ever fails, `remote-gate.sh` aborts **before** running anything, because
a gate that can lie must not be trusted. Run it directly with `npm run gate:selftest`.

## Files

- `.github/workflows/ci.yml` — unchanged jobs; triggers set to `workflow_dispatch`.
- `.husky/pre-push` — fires the fast gate on every push.
- `scripts/gate/remote-gate.sh` — host driver (selftest → resolve path → run in WSL).
- `scripts/gate/wsl-gate.sh` — WSL side: isolated clone, pin to SHA, run `ci-local.sh`.
- `scripts/ci-local.sh` — the gate itself (`fast` native / `full` act).
- `scripts/gate/selftest.sh` — fail-closed integrity guard.
- `package.json` — `gate:fast`, `gate:full`, `gate:selftest`.

## One-time setup

None. On the first push, `wsl-gate.sh` clones the isolated `~/limpios-gate` from the
host working copy; the toolchain (`act`, Node via nvm, Docker) is already provisioned
in WSL. To pre-warm it: `npm run gate:fast`.

## Troubleshooting

- **First `gate:full` is slow** — `act` pulls the ~1 GB runner image once, then caches it.
- **Docker not running in WSL** — `act` needs it; `docker ps` should succeed.
- **`act` skips a job** — jobs run under the `workflow_dispatch` event (no branch
  filter). `scripts/ci-local.sh` sets this via `ACT_EVENT`.
- **"could not resolve a WSL path"** — the `Ubuntu-22.04` distro isn't running; `wsl -l -v`
  should list it as `Running`. Override with `CI_LOCAL_WSL_DISTRO` if you renamed it.
- **Need to bypass in an emergency** — `git push --no-verify`.

## Maintenance notes

Setting the local gate up surfaced three things that had been broken on a clean checkout
while GitHub CI was creditless (Vercel hid them because it runs `npm install`, not `npm ci`):

- **Lockfile toolchain — keep it npm 10.** CI (`setup-node` node 20), the WSL gate (npm
  10.9.8 / node 22), and `act` all use **npm 10**; this dev host's Git-Bash side runs a
  newer npm. Newer npm writes a lockfile form npm 10 rejects (extra `libc` fields; a
  deduped `@swc/helpers` that npm 10 wants nested), so `npm ci` fails. The committed
  `package-lock.json` is the **npm-10** form — readable by both, so `npm ci` is green
  everywhere. If you run `npm install` under a newer npm it may re-drift the lock; the fast
  gate will catch it (`npm ci` fails on push). To resync, regenerate with npm 10 — e.g. in
  WSL `cd ~/limpios-gate && npm install --package-lock-only` — and commit the result.
- **`typecheck` self-generates Next types.** `npm run typecheck` is `next typegen && tsc
  --noEmit`. `next-env.d.ts` (which declares `*.jpeg`/image module types) is gitignored and
  only written by a build, so on a clean checkout `tsc` needs `next typegen` first. Don't drop
  that prefix. In the *fast* gate, `build` runs after the parallel checks (not alongside) so
  `next build` never races `tsc` over `.next/types`.
- **Vercel telemetry in the smoke test.** `audit/smoke.mjs` allowlists `/_vercel/insights/`
  and `/_vercel/speed-insights/` — those scripts exist only on Vercel's edge and 404 under
  `next start`. If you add another `@vercel/*` client script, add it to `IGNORE_RESOURCE`.
