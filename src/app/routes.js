const { Router } = require('express');
const router = Router();

let items = [];

// Create
router.post('/items', (req, res) => {
  const item = {
    id: Date.now(),
    name: req.body.name
  };
  items.push(item);
  res.status(201).json(item);
});

// Read
router.get('/items', (req, res) => {
  res.json(items);
});

// Update
router.put('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = items.find(i => i.id === id);

  if (!item) return res.status(404).json({ message: 'Not found' });

  item.name = req.body.name;
  res.json(item);
});

// Delete
router.delete('/items/:id', (req, res) => {
  const id = Number(req.params.id);
  items = items.filter(i => i.id !== id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
