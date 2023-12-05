import 'dotenv/config';
import express, { json } from 'express';
import db from './db';
import router from './routes';

const PORT = process.env.port || 8080;
const app = express();
app.use(json());

app.use('/qa', router);

app.get('/', async (req, res) => {
  db.query('select * from questions limit 10;');
  res.send('Hello there');
});

app.listen({ port: PORT }, () => {
  console.log(`Started server on port ${PORT}`);
});
