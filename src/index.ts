import 'dotenv/config';
import express, { json } from 'express';
import db from './db';

const PORT = process.env.port || 8080;
const server = express();
server.use(json());

server.get('/', async (req, res) => {
  db.query('SELECT * FROM questions');
  res.send('Hello there');
});

server.listen({ port: PORT }, () => {
  console.log(`Started server on port ${PORT}`);
});
