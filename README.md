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

## Docker Hub → VM

Set **`yourdockerhub`** in `docker-compose.yml` to your Docker Hub username (lowercase), once.

### On your laptop (build + push)

From the repo root:

```bash
docker login
docker compose build
docker compose push
```

### On the VM (pull + run)

Put the same `docker-compose.yml` on the VM (e.g. `git clone` the repo, or `scp docker-compose.yml user@vm:`). Then:

```bash
cd /path/to/spectent_assignment
docker login
docker compose pull
docker compose up -d
```

Open `http://YOUR_VM_IP:8081`.

**VM without the repo:** use a tiny compose file that only references the image (no `build:`):

```yaml
services:
  web:
    image: yourdockerhub/spectent-feedback:latest
    ports:
      - "8081:8080"
```

Then: `docker compose pull && docker compose up -d` in that folder.

### Stop / logs

```bash
docker compose logs -f
docker compose down
```

## API

`POST /feedback` — JSON: `{ "name", "email", "feedback" }`.  
`201` → `{ "ok": true, "message": "..." }` · `400` → `{ "ok": false, "error": "..." }`.

## Write-up

**[DOCUMENT.md](./DOCUMENT.md)** — failure modes, fixes, approach.
