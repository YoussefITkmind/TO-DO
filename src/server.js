import express from 'express';

import movieRoutes from './routes/movieRoutes.js';

const app = express();

app.use('/movies', movieRoutes);

const port = 5000;



const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = server;