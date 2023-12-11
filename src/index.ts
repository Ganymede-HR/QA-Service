import 'dotenv/config';
import express, { json } from 'express';
import morgan from 'morgan';
import router from './routes';

const PORT = process.env.port || 8080;
const app = express();
app.use(morgan('tiny'));
app.use(json());

app.use('/qa', router);

app.get('/', async (req, res) => {
  res.send('Hello there');
});

const server = app.listen({ port: PORT }, () => {
  console.log(`Started server on port ${PORT}`);
});

const closeServer = () => (
  new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) {
        console.error('Error closing server', err);
        reject(err);
      } else {
        console.log('Server closed');
        resolve(null);
      }
    });
  })
);
export { app, closeServer };
