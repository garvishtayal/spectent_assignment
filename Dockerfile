# Build SPA
FROM node:20-alpine AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Build API + bundle static files next to binary in image layer
FROM golang:1.22-alpine AS backend
WORKDIR /src
COPY server/go.mod server/go.sum ./
RUN go mod download
COPY server/ ./
COPY --from=frontend /frontend/dist ./static
RUN CGO_ENABLED=0 GOOS=linux go build -o /feedback-server .

FROM alpine:3.19
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=backend /feedback-server ./server
COPY --from=backend /src/static ./static
ENV GIN_MODE=release
ENV PORT=8080
EXPOSE 8080
CMD ["./server"]
