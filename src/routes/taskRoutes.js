import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});


router.post('/23ml', (req, res) => {
  res.json({ message: 'Hello World!' });
});


router.get('/hat', (req, res) => {
  res.json({ message: 'Hello World!' });
});


router.get('/hat/:id', (req, res) => {
  res.json({ message: 'Hello World!' });
});


router.put('/ghayer', (req, res) => {
  res.json({ message: 'Hello World!' });
});


router.get('/delete', (req, res) => {
  res.json({ message: 'Hello World!' });
});

export default router;