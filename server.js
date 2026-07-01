const { execFile } = require('child_process');
const express = require('express');
const fs = require('fs/promises');
const os = require('os');
const { promisify } = require('util');

const app = express();
const PORT = process.env.PORT || 3000;
const execFileAsync = promisify(execFile);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  next();
});

function getCpuSnapshot() {
  return os.cpus().map((cpu) => {
    const times = cpu.times;
    const total = Object.values(times).reduce((sum, time) => sum + time, 0);

    return {
      idle: times.idle,
      total,
    };
  });
}

function calculateCpuUsage(start, end) {
  if (start.length === 0 || end.length === 0) {
    return 0;
  }

  const usages = end.map((cpu, index) => {
    const previous = start[index];

    if (!previous) {
      return 0;
    }

    const idle = cpu.idle - previous.idle;
    const total = cpu.total - previous.total;

    if (total <= 0) {
      return 0;
    }

    return (1 - idle / total) * 100;
  });

  const average = usages.reduce((sum, usage) => sum + usage, 0) / usages.length;
  return Math.round(average);
}

async function getCpuUsage() {
  const start = getCpuSnapshot();

  await new Promise((resolve) => {
    setTimeout(resolve, 100);
  });

  return calculateCpuUsage(start, getCpuSnapshot());
}

function getRamUsage() {
  const total = os.totalmem();
  const free = os.freemem();

  if (total <= 0) {
    return 0;
  }

  return Math.round(((total - free) / total) * 100);
}

async function getDiskUsage() {
  const stats = await fs.statfs('/');

  if (stats.blocks <= 0) {
    return 0;
  }

  const usedBlocks = stats.blocks - stats.bfree;
  return Math.round((usedBlocks / stats.blocks) * 100);
}

async function getRunningContainerCount() {
  const { stdout } = await execFileAsync('docker', ['ps', '-q'], {
    timeout: 5000,
  });

  return stdout
    .split('\n')
    .filter((containerId) => containerId.trim().length > 0)
    .length;
}

function formatUptime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const parts = [];

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
  }

  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }

  if (parts.length === 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }

  return parts.join(' ');
}

async function getInfrastructureStatus() {
  const [cpu, storage, containers] = await Promise.all([
    getMetricValue(getCpuUsage, 0),
    getMetricValue(getDiskUsage, 0),
    getMetricValue(getRunningContainerCount, 0),
  ]);

  return {
    cpu,
    ram: getRamUsage(),
    storage,
    containers,
    uptime: formatUptime(os.uptime()),
    ssl: 'Valid',
    lastUpdated: new Date().toISOString(),
  };
}

async function getMetricValue(getter, fallbackValue) {
  try {
    return await getter();
  } catch (error) {
    console.error(`Metric collection failed: ${error.message}`);
    return fallbackValue;
  }
}

app.get('/', (req, res) => {
  res.json({
    name: 'Portfolio API',
    status: 'online',
  });
});

app.get('/api/status', async (req, res) => {
  res.json(await getInfrastructureStatus());
});

app.listen(PORT, () => {
  console.log(`Portfolio API listening on port ${PORT}`);
});
