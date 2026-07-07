# Local CI on a self-hosted VM (`act`)

GitHub-hosted Actions minutes are exhausted, so CI runs on a self-hosted Ubuntu VM
instead. The **same** `.github/workflows/ci.yml` is the source of truth — it's just
executed locally by [`act`](https://github.com/nektos/act) (which runs GitHub
Actions workflows in Docker) plus a fast native pass, wired to `git push` via a
`.husky/pre-push` hook.

Nothing about the app changed. If GitHub minutes ever return, re-enable the
workflow's `push`/`pull_request` triggers (see the comment at the top of `ci.yml`).
To stop gating pushes locally, remove `.husky/pre-push` (and optionally the
`vm-gate` remote).

## Two levels

| Level | When | Runs | Time | How |
|---|---|---|---|---|
| **fast** | every `git push` (pre-push hook) | `checks` job, **natively**: placeholders ‖ typecheck ‖ lint ‖ test ‖ build | ~2–3 min | `npm run gate:fast` |
| **full** | before merging to `main` | **both** jobs via `act`: `checks` ‖ `smoke` (Playwright), node-20-in-container | ~6–8 min (first run pulls a ~1 GB image) | `npm run gate:full` |

- **fast** is native (no Docker) for speed — a quick "is this push sane?" check. It
  uses the VM's Node 22, so it's a close-but-not-identical stand-in.
- **full** is the authoritative reproduction: `act` runs the exact workflow steps in
  the `catthehacker/ubuntu:act-latest` container on Node 20, including the Playwright
  smoke job. Run it before you merge.

Both are **fail-closed** (see "Integrity" below). Escape hatch for emergencies:
`git push --no-verify` skips the hook entirely.

## Architecture

```
host (Windows)                          VM (kida@192.168.246.129)
──────────────                          ─────────────────────────
git push origin …
  └─ .husky/pre-push
       └─ scripts/gate/remote-gate.sh fast <sha>
            1. selftest.sh           (host, <1s — proves gate can't lie green)
            2. git push vm-gate <sha>:gate ───────►  ~/limpios-gate.git   (bare mirror)
            3. ssh … ─────────────────────────────►  ~/limpios-gate       (workdir)
                                                        git reset --hard origin/gate
                                                        bash scripts/ci-local.sh fast
       exit ≠ 0  ⇒  push aborted
```

- `vm-gate` → `kida@192.168.246.129:limpios-gate.git`. The `pre-push` hook skips its
  own sync push (`$1 == vm-gate`) to avoid recursion.
- It gates the **committed** HEAD (what you're publishing), not your dirty tree.

### Total isolation from the Carbonell project

The VM also hosts an unrelated project (Carbonell). This setup lives entirely in its
own paths and **never touches** anything named `carbonell`:

- Owns: `~/limpios-gate.git` (bare), `~/limpios-gate` (workdir), remote `vm-gate`.
- Reuses only the shared read-only toolchain under `~/.local` (Node, `act`) and the
  global `~/.config/act/actrc`.
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
- `scripts/gate/remote-gate.sh` — host→VM driver (selftest → sync → ssh run).
- `scripts/ci-local.sh` — the gate itself, runs on the VM (`fast` native / `full` act).
- `scripts/gate/selftest.sh` — fail-closed integrity guard.
- `package.json` — `gate:fast`, `gate:full`, `gate:selftest`.

## One-time setup (host)

```sh
git remote add vm-gate kida@192.168.246.129:limpios-gate.git
```

The VM side (`~/limpios-gate.git` bare + `~/limpios-gate` workdir) and the toolchain
(`act`, Node, Docker) are already provisioned.

## Troubleshooting

- **First `gate:full` is slow** — `act` pulls the ~1 GB runner image once, then caches it.
- **Docker not running on the VM** — `act` needs it; `docker ps` should succeed.
- **`act` skips a job** — jobs run under the `workflow_dispatch` event (no branch
  filter). `scripts/ci-local.sh` sets this via `ACT_EVENT`.
- **Need to bypass in an emergency** — `git push --no-verify`.

## Maintenance notes

Setting this up surfaced three things that had been broken on a clean checkout while
GitHub CI was creditless (Vercel hid them because it runs `npm install`, not `npm ci`):

- **Lockfile toolchain — keep it npm 10.** CI (`setup-node` node 20), the VM gate, and
  `act` all use **npm 10**; this dev host runs **npm 11** (node 24). npm 11 writes a lockfile
  form npm 10 rejects (extra `libc` fields; a deduped `@swc/helpers` that npm 10 wants
  nested), so `npm ci` fails. The committed `package-lock.json` is the **npm-10** form —
  readable by both, so `npm ci` is green everywhere. If you run `npm install` under npm 11 it
  may re-drift the lock; the fast gate will catch it (`npm ci` fails on push). To resync,
  regenerate with npm 10 — e.g. on the VM `cd ~/limpios-gate && npm install --package-lock-only`
  — and commit the result. (Or run `npm install` under node 20 locally.)
- **`typecheck` self-generates Next types.** `npm run typecheck` is `next typegen && tsc
  --noEmit`. `next-env.d.ts` (which declares `*.jpeg`/image module types) is gitignored and
  only written by a build, so on a clean checkout `tsc` needs `next typegen` first. Don't drop
  that prefix. In the *fast* gate, `build` runs after the parallel checks (not alongside) so
  `next build` never races `tsc` over `.next/types`.
- **Vercel telemetry in the smoke test.** `audit/smoke.mjs` allowlists `/_vercel/insights/`
  and `/_vercel/speed-insights/` — those scripts exist only on Vercel's edge and 404 under
  `next start`. If you add another `@vercel/*` client script, add it to `IGNORE_RESOURCE`.
