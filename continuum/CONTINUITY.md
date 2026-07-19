# Stage 2 Continuity

## 2026-07-19 governor milestone

- Added pre-provider dependency enforcement, conservative cost authorization, mission/daily/monthly budgets, provider-call limits, worker leases, provider resource locks, Safe Mode, emergency stop, and guaranteed normal-path release.
- Staging provider concurrency remains one. This is an enforced control, not evidence of a higher-concurrency production envelope.
- Continue with failure-injection guard-expiry/recovery tests, priority/fair scheduling, and server-backed Xenesis integration while preserving the shell isolation gate.

The production experience remains owned by the existing root index.html and its nine-scene client runtime. The Continuum module has no import, script tag, route, build step, or lifecycle dependency from that shell.

## Local continuation

Prerequisites: Node.js 22 or newer. Commands are local unless explicitly noted.

1. npm ci
2. npm run cf:typegen
3. npm run cf:migrate:local
4. npm test
5. npm run cf:dry-run
6. Optional local runtime: npx wrangler dev --config continuum/wrangler.jsonc --local

Local authenticated requests require X-Xen-Local-Actor, X-Xen-Local-Tenant, and X-Xen-Local-Authority. These headers are accepted only while both configured mode flags identify the local reconstruction. Non-local authentication fails closed because Access JWT verification is deliberately not configured.

## Recovery model

- Mission state and idempotency are owned by the SQLite Durable Object.
- D1 provides shared indexes, evidence, workflow, delivery, and dead-letter records.
- Queue delivery and completed execution are separate facts.
- Workflow steps use deterministic idempotency keys and retry limits.
- WebSocket clients reconnect and request the current Durable Object snapshot.
- R2 artifact keys are content-addressed by SHA-256.

## External boundary

The base configuration remains local-only. The explicit `staging` environment is deployed behind cryptographically verified Cloudflare Access with D1, Queue, Workflow, Durable Object and R2 bindings. Production remains unauthorized. Secrets must be entered interactively and must never enter source, logs, screenshots, generated files or deployment output.
