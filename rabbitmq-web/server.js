const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const amqp = require('amqplib');

const RABBIT_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const QUEUE = process.env.QUEUE_NAME || 'my_queue';

async function start() {
  // Express + Socket.IO
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);

  app.use(express.static('public'));

  server.listen(3000, () => {
    console.log('Listening on http://0.0.0.0:3000');
  });

  // RabbitMQ setup
  const conn = await amqp.connect(RABBIT_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE, { durable: true });

  console.log(`Connected to RabbitMQ at ${RABBIT_URL}, queue "${QUEUE}"`);

  // При отриманні — відсилаємо всім веб-клієнтам
  channel.consume(QUEUE, msg => {
    if (!msg) return;
    const content = msg.content.toString();
    io.emit('new_message', content);
    channel.ack(msg);
  });
}

start().catch(err => {
  console.error(err);
  process.exit(1);
});
