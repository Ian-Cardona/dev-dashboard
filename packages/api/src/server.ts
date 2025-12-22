import app from './app.js';
import { ENV } from './config/env';

const port = ENV.PORT;

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

server.timeout = 35000;
server.keepAliveTimeout = 36000;
server.headersTimeout = 37000;
