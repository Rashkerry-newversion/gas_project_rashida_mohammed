const pkg = require('../package.json');
module.exports = function health() {
  return {
    status: 'ok',
    service: 'gas-project',
    version: pkg.version || process.env.APP_VERSION || '0.0.0',
    timestamp: new Date().toISOString()
  };
};
