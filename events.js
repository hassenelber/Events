const http = require('http');
const app = require('./eventsApp');

const port = process.env.PORT ||  7778;

const server = http.createServer(app);

server.listen(port);

