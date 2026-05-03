# Feedback form — Spectent internship assignment

React (JS) + **Go / Gin**. Feedback stored **in memory**. No database.

![Feedback form UI](docs/screenshot.png)

## Tech

| Layer    | Stack                                    |
|----------|------------------------------------------|
| Frontend | React 18, Vite                           |
| Backend  | Go, Gin                                  |
| Run      | **Docker Compose** (builds `Dockerfile`) |

## Local dev

```bash
cd server && go run .
```

```bash
cd frontend && npm install && npm run dev
```

UI proxies `/feedback` to the API (Vite default: port **5173** → API **8080**).

## Docker (build / VM)

1. In **`docker-compose.yml`**, replace `yourdockerhub` with your Docker Hub username (lowercase).
2. Build and push from your machine:

```bash
docker compose build
docker compose push
```

3. On the VM (same `docker-compose.yml`, or only the `image:` + `ports:` lines):

```bash
docker compose pull
docker compose up -d
```

App: `http://YOUR_VM_IP:8080` (UI and `POST /feedback` on the same host).

If the VM only has a compose file (no repo), drop the `build:` line and keep `image` + `ports`.

## API

`POST /feedback` — JSON: `{ "name", "email", "feedback" }`.  
`201` → `{ "ok": true, "message": "..." }` · `400` → `{ "ok": false, "error": "..." }`.

## Write-up

**[DOCUMENT.md](./DOCUMENT.md)** — failure modes, fixes, approach.
