# Portfolio API

Small Node.js and Express API for portfolio infrastructure metrics.

The metrics are hardcoded for now. The status helper in `server.js` is the place to replace them later with live Docker, Proxmox, or host metrics.

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
  "lastDeploy": "2 minutes ago"
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
docker compose up --build
```

Stop it:

```bash
docker compose down
```
