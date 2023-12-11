import mysql from 'mysql2/promise';

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  RESET_TEST_DATABASE,
} = process.env || {};

if (!DATABASE_HOST || !DATABASE_PORT || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME) {
  throw new Error('missing database credentials');
}

const db = mysql.createPool({
  host: DATABASE_HOST,
  user: DATABASE_USER,
  port: +DATABASE_PORT,
  password: DATABASE_PASSWORD,
  waitForConnections: true,
  timezone: 'Z',
});

const initializeDB = async () => {
  if (JSON.parse(RESET_TEST_DATABASE || 'false') === true) {
    if (!DATABASE_NAME.includes('_TEST')) {
      throw new Error(`Missing or invalid test database: ${DATABASE_NAME}`);
    } else {
      await db.execute(`DROP DATABASE IF EXISTS ${DATABASE_NAME}`);
    }
  }
  await db.execute(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);
  await db.query(`USE ${DATABASE_NAME}`);
  await db.execute(`CREATE TABLE IF NOT EXISTS questions (
    id INT NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    body TEXT,
    date_written DATETIME DEFAULT CURRENT_TIMESTAMP,
    asker_name VARCHAR(64),
    asker_email VARCHAR(64),
    reported BOOLEAN NOT NULL DEFAULT FALSE,
    helpful INT NOT NULL DEFAULT 0,

    PRIMARY KEY (id)
  )`);
  await db.execute(`CREATE TABLE IF NOT EXISTS answers (
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
  )`);
  await db.execute(`CREATE TABLE IF NOT EXISTS answer_photos (
    id INT NOT NULL AUTO_INCREMENT, 
    answer_id INT NOT NULL, 
    url TEXT NOT NULL, 

    PRIMARY KEY (id), 
    FOREIGN KEY (answer_id) REFERENCES answers(id)
  )`);
  try {
    await db.execute('CREATE INDEX questions_products_reported_idx ON questions (product_id, reported)');
  } catch (err) {
    console.log('questions_products_reported_idx creation skipped');
  }
  try {
    await db.execute('CREATE INDEX answers_question_reported_idx ON answers (question_id, reported)');
  } catch (err) {
    console.log('answers_question_reported_idx index creation skipped');
  }
};

const dbInitPromise = initializeDB();

export { db, dbInitPromise, initializeDB };
