const settings = require('./settings.json');
let http = require('http');

let options = {
  timeout: 2000,
  host: 'localhost',
  port: settings.apiPort || 4500,
  path: '/healthz' // must be the same as HEALTHCHECK in Dockerfile
};

let request = http.request(options, (res) => {
  console.info('STATUS: ' + res.statusCode);
  process.exitCode = (res.statusCode === 200) ? 0 : 1;
  process.exit();
});

request.on('error', function (err) {
  console.error('ERROR', err);
  process.exit(1);
});

request.end();