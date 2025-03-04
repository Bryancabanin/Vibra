import express from 'express';

const app = express();
const PORT = 8080;

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