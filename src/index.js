const express = require('express');
const morgan = require('morgan');
const { register, defaultMetrics } = require('./metrics');
const health = require('./health');
const appRoutes = require('./app/routes');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(morgan('tiny'));
app.use(express.json());

// metrics middleware
const { trackRequest } = require('./metrics');
app.use(trackRequest);

app.get('/', (req, res) => res.send('GAS Project — hello from app container'));
app.get('/health', (req, res) => res.json(health()));
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.use('/api', appRoutes);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
