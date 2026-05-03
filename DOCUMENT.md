# Build, break, explain

## 1. Ways the system can fail (8–10)

1. **Invalid JSON** — malformed body returns 400; user sees a clear error.
2. **Empty or whitespace-only fields** — treated as missing after trim.
3. **Bad email** — wrong shape or disposable patterns not caught by a simple regex (trade-off: regex is not a full RFC parser).
4. **Huge payloads** — oversized name/feedback could exhaust memory; mitigated with length caps.
5. **Concurrent writes** — multiple POSTs at once; mitigated with a mutex on the in-memory slice.
6. **Server restart** — all stored feedback disappears (in-memory only).
7. **Network errors** — UI shows a friendly message if the API is down.
8. **Double submit** — user can click twice quickly; could duplicate entries (no idempotency key).
9. **CORS** — direct browser calls to another origin would fail without headers or a proxy (dev uses Vite proxy).
10. **Abuse / spam** — no rate limit; a bot could flood POST (not addressed in this minimal scope).

## 2. Top three fixes (chosen + why)

| Issue                         | Fix                                      | Why |
|-------------------------------|------------------------------------------|-----|
| Race on concurrent POSTs      | `sync.Mutex` around append               | Safe concurrent updates without data races. |
| Unbounded text / memory abuse | Max length on name and feedback (UTF-8)   | Keeps memory predictable for a demo service. |
| Sloppy input                  | Trim fields; normalize email to lowercase | Fewer false “invalid” errors; consistent storage. |

## 3. Approach

- **Single POST handler** with JSON binding keeps the API obvious for reviewers.
- **Validation before append** returns 400 with a short `error` string the UI can show as-is.
- **Trade-offs:** regex email check is fast and good enough for coursework; a real product might use a dedicated library or verification flow. In-memory storage is simplest and meets the brief; persistence would be the first upgrade.
- **With more time:** persist to PostgreSQL or SQLite, add rate limiting, idempotency or CAPTCHA for spam, structured logging, and an admin read endpoint with auth.

## 4. Scale (optional)

With **~10,000 active users**, in-memory storage would not survive restarts or multiple server instances; you would need a **shared database**, **horizontal scaling behind a load balancer**, and **rate limiting** at the edge. Write-heavy spikes could bottleneck a single DB unless you queue writes or shard. Observability (metrics, tracing) becomes necessary to find hot spots.
