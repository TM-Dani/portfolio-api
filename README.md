# Portfolio API

Small Node.js and Express API for portfolio infrastructure metrics and a read-only Docker container overview.

## Endpoints

### `GET /`

```json
{
  "name": "Portfolio API",
  "status": "online"
}
```

### `GET /api/status`

```json
{
  "cpu": 10,
  "ram": 22,
  "storage": 52,
  "containers": 3,
  "uptime": "1 day",
  "ssl": "Valid",
  "lastUpdated": "2026-07-22T20:45:00.000Z"
}
```

### `GET /api/containers`

Returns a read-only overview of Docker containers from the Docker CLI.

```json
{
  "total": 3,
  "running": 3,
  "stopped": 0,
  "containers": [
    {
      "name": "portfolio",
      "image": "nginx:alpine",
      "status": "Up 2 days",
      "state": "running",
      "ports": "0.0.0.0:8080->80/tcp",
      "running": true
    }
  ],
  "lastUpdated": "2026-07-22T20:45:00.000Z"
}
```

## Run Locally

Install dependencies:

```bash
npm install
```

Start the API:

```bash
npm start
```

The API will run at:

```text
http://localhost:3000
```

## Run With Docker

Build and start the container:

```bash
docker compose up -d --build
```

Stop it:

```bash
docker compose down
```
