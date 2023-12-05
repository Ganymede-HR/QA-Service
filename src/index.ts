import 'dotenv/config';
import fastify from 'fastify'; 
import db from './db';

const server = fastify(); 

server.get('/', async(req, res) => {
  db.query('SELECT * FROM questions');
	return 'Hello there!';
});

server.listen({ port: 8080 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);  
	}
	console.log(`Started server at ${address}`);
})
