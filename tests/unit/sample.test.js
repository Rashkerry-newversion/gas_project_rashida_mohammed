const health = require('../../src/health');
test('health returns status ok', () => {
  const h = health();
  expect(h.status).toBe('ok');
  expect(h.version).toBeDefined();
});
