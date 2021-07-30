DROP TABLE IF EXISTS characteristics_reviews;
DROP TABLE IF EXISTS characteristics;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS reviews_temp;
DROP SEQUENCE IF EXISTS reviews_seq;
DROP SEQUENCE IF EXISTS photos_seq;
DROP SEQUENCE IF EXISTS characteristics_seq;
DROP SEQUENCE IF EXISTS characteristics_reviews_seq;

-- REVIEWS TABLE
CREATE TABLE reviews_temp (
  id INT PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  date BIGINT NOT NULL,
  summary VARCHAR (255) NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  reviewer_name VARCHAR (255) NOT NULL,
  reviewer_email VARCHAR (255) NOT NULL,
  response VARCHAR (1000) NOT NULL,
  helpfulness INT NOT NULL
);

CREATE TABLE reviews (
  id INT PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  date TIMESTAMP NOT NULL,
  summary VARCHAR (255) NOT NULL,
  body TEXT NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL DEFAULT false,
  reviewer_name VARCHAR (255) NOT NULL,
  reviewer_email VARCHAR (255) NOT NULL,
  response VARCHAR (1000),
  helpfulness INT NOT NULL DEFAULT 0
);

-- Copy data into a temporary reviews table that we will use next
\COPY reviews_temp FROM '/Users/jabrake/Downloads/reviews.csv' DELIMITER ',' CSV HEADER;

-- Copy data from temporary reviews table into the reviews table we will use for queries, transforming timestamp value
INSERT INTO reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
SELECT id, product_id, rating, to_timestamp(date/1000), summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness
FROM reviews_temp;

-- Create a sequence for reviews table to make sure new reviews generate a unique id
CREATE SEQUENCE reviews_seq START 1;
SELECT setval('reviews_seq', max(id)) FROM reviews;
ALTER TABLE reviews ALTER COLUMN id SET DEFAULT nextval('reviews_seq');

-- Create index for reviews table
CREATE INDEX idx_product_id_reviews ON reviews(product_id);

-- PHOTOS TABLE
CREATE TABLE photos (
  id INT PRIMARY KEY,
  review_id INT NOT NULL REFERENCES reviews(id),
  url TEXT NOT NULL
);

-- Copy data directly into photos table
\COPY photos FROM '/Users/jabrake/Downloads/reviews_photos.csv' DELIMITER ',' CSV HEADER;

-- Create a sequence for photos table to make sure new photos generate a unique id
CREATE SEQUENCE photos_seq START 1;
SELECT setval('photos_seq', max(id)) FROM photos;
ALTER TABLE photos ALTER COLUMN id SET DEFAULT nextval('photos_seq');

-- Create index for photos table
CREATE INDEX idx_review_id_photos ON photos(review_id);

-- CHARACTERISTICS TABLES
CREATE TABLE characteristics (
  id INT PRIMARY KEY,
  product_id INT NOT NULL,
  name VARCHAR (255) NOT NULL
);

CREATE TABLE characteristics_reviews (
  id INT PRIMARY KEY,
  characteristic_id INT NOT NULL REFERENCES characteristics(id),
  review_id INT NOT NULL REFERENCES reviews(id),
  value INT NOT NULL
);

\COPY characteristics FROM '/Users/jabrake/Downloads/characteristics.csv' DELIMITER ',' CSV HEADER;

\COPY characteristics_reviews FROM '/Users/jabrake/Downloads/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

-- Create a sequence for characteristics table to make sure new characteristics generate a unique id
CREATE SEQUENCE characteristics_seq START 1;
SELECT setval('characteristics_seq', max(id)) FROM characteristics;
ALTER TABLE characteristics ALTER COLUMN id SET DEFAULT nextval('characteristics_seq');

-- Create a sequence for characteristics_reviews table to make sure new characteristics_reviews entries generate a unique id
CREATE SEQUENCE characteristics_reviews_seq START 1;
SELECT setval('characteristics_reviews_seq', max(id)) FROM characteristics_reviews;
ALTER TABLE characteristics_reviews ALTER COLUMN id SET DEFAULT nextval('characteristics_reviews_seq');

-- Create index for both characteristics tables
CREATE INDEX idx_product_id_characteristics ON characteristics(product_id);
CREATE INDEX idx_review_id_characteristics_reviews ON characteristics_reviews(review_id);

-- Delete temporary reviews table
DROP TABLE IF EXISTS reviews_temp;
