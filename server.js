const app = require('./app');
const config = require('./config');
const connectDb = require('./connection');

const port = config.serverPort;

connectDb()
  .then(() => {
    console.log('Database connected');
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
  })
  .catch((err) => {
    console.error(`Error happened while starting server.`, err);
    process.exit(1);
  });
