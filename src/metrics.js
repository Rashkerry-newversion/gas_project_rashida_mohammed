const client = require('prom-client');

// collect default node metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics({ prefix: 'node_' });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['route', 'method', 'status']
});

module.exports = {
  register: client.register,
  defaultMetrics: () => {},
  trackRequest: (req, res, next) => {
    res.on('finish', () => {
      try {
        httpRequestCounter.inc({
          route: req.route ? req.route.path : req.path,
          method: req.method,
          status: res.statusCode
        });
      } catch (e) {
        // safe guard for routes without req.route
        httpRequestCounter.inc({ route: req.path, method: req.method, status: res.statusCode });
      }
    });
    next();
  }
};
