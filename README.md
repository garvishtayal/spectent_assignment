# Feedback form — Spectent internship assignment

A small full-stack **feedback form**: React (JavaScript) frontend and **Go + Gin** API. Feedback is stored **in memory** (no database), matching the brief.

## Purpose

Users submit **name**, **email**, and **feedback**. The API validates input and keeps submissions in a process-local list for the assignment demo.

## Tech

| Layer    | Stack                                      |
|----------|--------------------------------------------|
| Frontend | React 18, Vite, plain JS (no TypeScript)   |
| Backend  | Go 1.22+, Gin                              |
| Storage  | In-memory slice (lost on server restart)   |

## Run locally

**Terminal 1 — API**

```bash
cd server
go run .
```

Server listens on **http://127.0.0.1:8080** — endpoint: `POST /feedback`.

**Terminal 2 — UI**

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually **http://127.0.0.1:5173**). The dev server proxies `/feedback` to the Go API, so CORS is not an issue during development.

**Production-style frontend build**

```bash
cd frontend
npm run build
npm run preview
```

Point `vite.config.js` proxy at your API host if the backend is not on `8080`.

## API

`POST /feedback` — JSON body:

```json
{ "name": "string", "email": "string", "feedback": "string" }
```

Success: `201` with `{ "ok": true, "message": "..." }`.  
Validation or bad JSON: `400` with `{ "ok": false, "error": "..." }`.

## Assignment write-up

See **[DOCUMENT.md](./DOCUMENT.md)** for failure modes, fixes, design notes, and optional scale thoughts.
