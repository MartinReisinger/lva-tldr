# Coolify migration: lva-tldr

Status: local preparation only; production cutover and push deployment disabled.

## Exact application settings

- Actual deployment repository: `https://github.com/MartinReisinger/lva-tldr.git`.
- Branch: `main` (cached default unless a source blocker is noted below).
- Domain: `https://lva-tldr.martindev.at`.
- Build pack: **Dockerfile**; base/build directory: `/`; Dockerfile: `/Dockerfile`.
- Exposed internal HTTP port: **3000**. Do not use the old host proxy port.
- Existing application/container from the VPS inventory: `lva-tldr`.

### Source blocker

The actual configured remote is GitHub, not Forgejo. Cached `origin/HEAD` is
`main`. No Forgejo remote is configured locally; a Forgejo mirror URL and
read access for the provided deploy key must be established and verified.
Do not assume a `git.martindev.at/.../lva-tldr.git` repository exists.
The old GitHub registry/SSH deployment workflow has been removed. The new
manual-only Forgejo workflow requires that mirror before it can be used.

### Runtime variables

`NODE_ENV=production`, `HOST=0.0.0.0`, `PORT=3000`, `TZ=Europe/Vienna`,
`NUXT_QUIZ_DATABASE_PATH=/app/.data/quiz-progress.sqlite`.
Preserve optional Google sync configuration: `NUXT_OAUTH_GOOGLE_CLIENT_ID`,
`NUXT_OAUTH_GOOGLE_CLIENT_SECRET`, `NUXT_OAUTH_GOOGLE_REDIRECT_URL`,
`NUXT_SESSION_PASSWORD`. The redirect URI is `/auth/google` on the public origin.
Anonymous quizzes remain available without OAuth configuration.

### Persistent state, backup and health

`deploy/vps/compose.yml` uses named volume `quiz-data` at `/app/.data`.
The actual existing Docker volume name is Compose-project-prefixed: inspect
it manually before cutover; it is not proven to be literally `quiz-data`.
Reuse that exact existing volume (or its verified existing host mountpoint) at
`/app/.data`; do not create a replacement volume. SQLite/Drizzle stores users
and quiz progress in `quiz-progress.sqlite`, using WAL, foreign keys and a
5000 ms busy timeout. Startup creates missing tables.
The image entrypoint now rejects a missing/empty quiz DB before server startup.
If sync has never been initialized, explicitly resolve provisioning from the
actual old deployment before proceeding; this preparation creates no database.
Development initialization is unchanged.

Back up quiz SQLite with its backup API or while the writer is quiesced;
preserve WAL-consistent data and all existing volume contents. Nuxt Content
builds its separate derived content DB from committed content; it is not a
replacement for the persistent quiz DB.
Health: HTTP GET `/` on 3000; no dedicated endpoint. Google OAuth needs outbound
HTTPS and the original public URLs must remain unchanged.

### Audit

Node 24 Alpine, pnpm 11.6.0, `pnpm-lock.yaml`, `pnpm-workspace.yaml`.
Existing build is retained, with no secret build ARG/ENV and no Git-dependent
build script found. Local validation uses `pnpm typecheck` and `pnpm test`, as
required by AGENTS.md. Compose is old VPS infrastructure, not development CI.

## Coolify resource and deployment control

Prepare a Dockerfile application in Coolify **v4.4.6** at
`https://sites.martindev.at`:

- Project: `ojc126vnw19sfdm8j3fuid7j`; environment: `production`.
- Server: `7cstfqi5wnx13pajabwjynnz` (`vps-m`, `82.165.71.131`).
- Forgejo deploy key: `jpdkjwpf8fgsbyanqadzqwgr`; SSH port: `2222`.
- Disable Coolify auto-deploy, Git-provider push hooks and preview deployments.
- Set runtime secrets in Coolify; do not mark them as build variables.
- Configure the persistent mounts before any first start. Never use an empty
  generated volume in place of existing production data.

`.forgejo/workflows/deploy.yml` is **manual-only** (`workflow_dispatch`).
It uses `vps-runner` with `container.image: local/runner-env`. The local
`vps-m-2026/VPS_README.md` documents this Docker runner label and a job image
containing curl. This is a documentation/configuration check, not a live runner test.
No checkout, registry build/push, SSH deployment, Compose operation or pruning
occurs in the workflow.

After the resource is configured and a test cutover has been approved, copy
its resource-specific Deploy Webhook into Forgejo Actions secret
`COOLIFY_WEBHOOK`, and a Coolify API token authorized to deploy that resource
into `COOLIFY_TOKEN`. Prefer a deploy-only token scoped to the resource's team.
Copy the application Webhooks → Deploy Webhook (auth required) URL, including
its `uuid` query parameter; never use the project/server/key UUID as the app UUID.
Do not guess the application UUID or webhook URL.
Confirm the HTTP method supported by the v4.4.6 resource's generated webhook
before running the prepared POST workflow. Never dispatch it for an unprepared
resource. A successful webhook request only queues deployment; confirm build
and application health separately in Coolify.

Only after explicit approval may `push: branches: [main]` be added. Configure
one deployment trigger to avoid duplicate deployments.

## Cutover and rollback (operator actions only)

1. Confirm the running image/commit, environment, actual mounts and ownership.
   Local infrastructure documents may be older than the running configuration.
2. Keep Caddy and the existing Compose configuration/image for rollback.
   Configure Traefik routes/TLS and resolve the shared host ports 80/443 before
   changing public routing. Do not publish the application's former localhost
   port through Coolify unless deliberately needed for rollback operations.
3. Build and validate on an isolated copy of state. Use a separate test resource,
   no production mounts, no production users/devices and no outbound side effects.
   Never start a second instance against the live SQLite files.
4. After explicit cutover approval, quiesce the old application's writes, create
   and verify a final consistent backup, and stop the old writer before the new
   writer starts. Bind the existing storage to the same container paths.
5. Start one Coolify instance; check health, authentication, data and public URLs.
   Keep automatic deployment disabled until these checks pass and are approved.
6. For rollback, quiesce/stop the new writer before restarting the old instance,
   and restore Caddy routing. If startup applied incompatible migrations, restore
   the verified pre-cutover backup plus matching files only after approval;
   preserve newer data first. Never run both writers or blindly downgrade a DB.

Nothing in this guide has been executed on the VPS. No production backup,
migration, storage operation, API call or deployment was performed by this task.

## References

- [Coolify applications](https://coolify.io/docs/applications/)
- [Coolify deploy webhooks](https://coolify.io/docs/core/automation/deploy-webhooks)
- [Coolify storage](https://coolify.io/docs/core/persistent-storage/storage-mounts/overview)
- [Forgejo Actions reference](https://forgejo.org/docs/v15.0/user/actions/reference/)
