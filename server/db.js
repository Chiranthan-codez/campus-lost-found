const net = require('net');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const mongoose = require('mongoose');

function isPortOpen(port, host = '127.0.0.1') {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(800);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

let mongodProc = null;

function shutdownMongod() {
  if (mongodProc && !mongodProc.killed) {
    try {
      mongodProc.kill('SIGINT');
    } catch (_) {}
  }
}

process.on('SIGINT', shutdownMongod);
process.on('SIGTERM', shutdownMongod);
process.on('exit', shutdownMongod);

async function connectDB() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/campus-lost-found';
  const isLocal = uri.includes('127.0.0.1') || uri.includes('localhost');

  if (isLocal) {
    const portMatch = uri.match(/:(\d+)/);
    const port = portMatch ? parseInt(portMatch[1], 10) : 27017;
    const listening = await isPortOpen(port);

    if (!listening) {
      console.log(`Port ${port} not running. Starting embedded MongoDB...`);
      try {
        const { MongoBinary } = require('mongodb-memory-server');
        const mongodPath = await MongoBinary.getPath();
        const dataDir = path.resolve(__dirname, '..', '.mongo_data');
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true });
        }

        mongodProc = spawn(mongodPath, [
          '--dbpath', dataDir,
          '--port', String(port),
          '--bind_ip', '127.0.0.1'
        ], {
          stdio: 'ignore'
        });

        // Wait for port to open
        let ready = false;
        for (let i = 0; i < 40; i++) {
          await new Promise((r) => setTimeout(r, 250));
          if (await isPortOpen(port)) {
            ready = true;
            break;
          }
        }
        if (ready) {
          console.log(`Embedded MongoDB started successfully on port ${port}.`);
        } else {
          console.warn(`Embedded MongoDB spawned, continuing with connection attempt...`);
        }
      } catch (err) {
        console.warn('Could not launch embedded MongoDB, attempting direct connection:', err.message);
      }
    }
  }

  return mongoose.connect(uri);
}

module.exports = { connectDB, shutdownMongod };
