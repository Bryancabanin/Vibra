import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8080;

app.use(
  cors({
    origin: 'http://localhost:5173', // Your frontend's URL
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies and credentials
  })
);
app.use(express.json());

app.get('/', (req, res) => {
    res.send('test');
});

app.use('*', (req, res, next) => {
    const err = new Error("test")
    res.status(500);
    next(err);
});

app.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error has occured' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
  
    console.log(errorObj.log);
  
   return res.status(errorObj.status).json(errorObj.message);
  });

  app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
  });

  module.exports = app;