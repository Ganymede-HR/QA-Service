-- csvs must be loaded into /var/lib/mysql into the location specified below
-- if secure-file-priv is enabled, load the data into the secure file location
-- and update path below. The secure file location can be found with 
-- SHOW VARIABLES LIKE 'secure_file_priv';
-- to load: mysql -u root -p -h 127.0.0.1 -P 3306 ganymede_QA < etl/seed.sql

LOAD DATA INFILE 'seed/data/questions.csv'
IGNORE -- ignore existing duplicate rows
INTO TABLE questions
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id, product_id, @body, @date_written, @asker_name, @asker_email, reported, helpful)
SET body = TRIM(BOTH '"' FROM @body),
    asker_name = TRIM(BOTH '"' FROM @asker_name),
    asker_email = TRIM(BOTH '"' FROM @asker_email),
    date_written = FROM_UNIXTIME(@date_written / 1000);

LOAD DATA INFILE 'seed/data/answers.csv'
IGNORE -- ignore existing duplicate rows
INTO TABLE answers
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id, question_id, @body, @date_written, @answerer_name, @answerer_email, reported, helpful)
SET body = TRIM(BOTH '"' FROM @body),
    answerer_name = TRIM(BOTH '"' FROM @answerer_name),
    answerer_email = TRIM(BOTH '"' FROM @answerer_email),
    date_written = FROM_UNIXTIME(@date_written / 1000);

LOAD DATA INFILE 'seed/data/answers_photos.csv'
IGNORE -- ignore existing duplicate rows
INTO TABLE answer_photos
FIELDS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(id, answer_id, @url)
SET url = TRIM(BOTH '"' FROM @url);