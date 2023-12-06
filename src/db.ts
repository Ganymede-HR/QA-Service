import mysql from 'mysql2/promise';

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
} = process.env || {};

const DATABASE = 'ganymede_QA';

if (!DATABASE_HOST || !DATABASE_PORT || !DATABASE_USER || !DATABASE_PASSWORD) {
  throw new Error('missing database credentials');
}

const db = mysql.createPool({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  port: +DATABASE_PORT,
  password: DATABASE_PASSWORD,
  waitForConnections: true,
});

db.query(`CREATE DATABASE IF NOT EXISTS ${DATABASE}`)
  .then(() => db.query(`USE ${DATABASE}`))
  .then(() => db.query(`CREATE TABLE IF NOT EXISTS questions (
  id INT NOT NULL AUTO_INCREMENT,
  product_id INT NOT NULL,
  body TEXT,
  date_written DATETIME DEFAULT CURRENT_TIMESTAMP,
  asker_name VARCHAR(64),
  asker_email VARCHAR(64),
  reported BOOLEAN NOT NULL DEFAULT FALSE,
  helpful INT NOT NULL DEFAULT 0,

  PRIMARY KEY (id)
 )`))
  .then(() => db.query(`CREATE TABLE IF NOT EXISTS answers (
  id INT NOT NULL AUTO_INCREMENT, 
  question_id INT NOT NULL,
  body TEXT,
  date_written DATETIME DEFAULT CURRENT_TIMESTAMP,
  answerer_name VARCHAR(64),
  answerer_email VARCHAR(64),
  reported BOOLEAN NOT NULL DEFAULT FALSE,
  helpful INT NOT NULL DEFAULT 0,

  PRIMARY KEY (id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
 )`))
  .then(() => db.query(`CREATE TABLE IF NOT EXISTS answer_photos (
  id INT NOT NULL AUTO_INCREMENT, 
  answer_id INT NOT NULL, 
  url TEXT NOT NULL, 

  PRIMARY KEY (id), 
  FOREIGN KEY (answer_id) REFERENCES answers(id)
 )`))
  .then(() => console.log('connected to', DATABASE));

export default db;
