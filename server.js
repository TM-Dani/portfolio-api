const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

function getInfrastructureStatus() {
  return {
    cpu: 10,
    ram: 22,
    storage: 52,
    containers: 3,
    uptime: '1 day',
    ssl: 'Valid',
    lastDeploy: '2 minutes ago',
  };
}

app.get('/', (req, res) => {
  res.json({
    name: 'Portfolio API',
    status: 'online',
  });
});

app.get('/api/status', (req, res) => {
  res.json(getInfrastructureStatus());
});

app.listen(PORT, () => {
  console.log(`Portfolio API listening on port ${PORT}`);
});
