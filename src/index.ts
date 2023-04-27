import express from 'express';

const server = express();

server.use(express.json());

server.get('/', (_req, res) => {
  return res.send('healthy');
});

server.listen(4000, () => {
  console.log(`server listening on port ${4000}`);
});

process.on('SIGTERM', (signal) => {
  console.error(`received a signal: [${signal}]. process exiting.`);
  process.exit(0);
});

process.on('SIGINT', (signal) => {
  console.error(`received a signal: [${signal}]. process exiting.`);
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error(`process exiting with uncaughtException: ${error.message}`, error);
  process.exit(1);
});

process.on('unhandledRejection', async (reason, promise) => {
  console.error(`process exiting with unhandledRejection ${promise} reason: ${reason}`);
  promise.catch((error) => console.error(error));
  process.exit(1);
});