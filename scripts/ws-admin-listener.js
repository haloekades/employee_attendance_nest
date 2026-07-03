// Local demo/test client for the admin notification WebSocket.
// Usage: ADMIN_TOKEN=<jwt-from-/auth/login> node scripts/ws-admin-listener.js
const { io } = require('socket.io-client');

const url = process.env.GATEWAY_URL ?? 'http://localhost:3000';
const token = process.env.ADMIN_TOKEN;

if (!token) {
  console.error(
    'Missing ADMIN_TOKEN. Log in as an admin via POST /auth/login and set:\n' +
      '  ADMIN_TOKEN=<access_token> node scripts/ws-admin-listener.js',
  );
  process.exit(1);
}

const socket = io(`${url}/notifications`, { auth: { token } });

socket.on('connect', () => {
  console.log(`Connected as admin listener (${socket.id}). Waiting for employee updates...`);
});

socket.on('employee.updated', (event) => {
  console.log('employee.updated:', event);
});

socket.on('connect_error', (err) => {
  console.error('Connection failed:', err.message);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
});
