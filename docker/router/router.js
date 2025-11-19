const http = require('http');
const { request } = require('http');

const BLUE = { host: 'app-blue', port: process.env.BLUE_PORT || 3001 };
const GREEN = { host: 'app-green', port: process.env.GREEN_PORT || 3002 };
const LISTEN = process.env.PORT || 3000;
const CANARY_PERCENT = Number(process.env.CANARY_PERCENT || 10); // 10% default to canary (green)

function chooseTarget() {
  const r = Math.random() * 100;
  return (r < CANARY_PERCENT) ? GREEN : BLUE;
}

const server = http.createServer((req, res) => {
  if (req.url === '/router-health') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({ router: 'ok', canaryPercent: CANARY_PERCENT }));
    return;
  }

  const target = chooseTarget();
  const proxyReq = request(
    { hostname: target.host, port: target.port, path: req.url, method: req.method, headers: req.headers },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    }
  );

  req.pipe(proxyReq, { end: true });
});

server.listen(LISTEN, () => console.log(`Router listening on ${LISTEN}. Canary percent=${CANARY_PERCENT}`));
