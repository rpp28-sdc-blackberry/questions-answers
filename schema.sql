DROP TABLE IF EXISTS meta;
DROP TABLE IF EXISTS characteristics_reviews_temp;
DROP TABLE IF EXISTS characteristics_temp;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS reviews_temp;

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
  reported BOOLEAN NOT NULL,
  reviewer_name VARCHAR (255) NOT NULL,
  reviewer_email VARCHAR (255) NOT NULL,
  response VARCHAR (1000) NOT NULL,
  helpfulness INT NOT NULL
);

-- Copy data into a temporary reviews table that we will use next
\COPY reviews_temp FROM '/Users/jabrake/Downloads/reviews.csv' DELIMITER ',' CSV HEADER;

-- Copy data from temporary reviews table into the reviews table we will use for queries, transforming timestamp value
INSERT INTO reviews (id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness)
SELECT id, product_id, rating, to_timestamp(date/1000), summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness
FROM reviews_temp;

-- PHOTOS TABLE
CREATE TABLE photos (
  id INT PRIMARY KEY,
  review_id INT NOT NULL REFERENCES reviews(id),
  url TEXT NOT NULL
);

-- Copy data directly into photos table
\COPY photos FROM '/Users/jabrake/Downloads/reviews_photos.csv' DELIMITER ',' CSV HEADER;

-- CHARACTERISTIC TABLES
CREATE TABLE characteristics_temp (
  id INT PRIMARY KEY,
  product_id INT NOT NULL,
  name VARCHAR (255) NOT NULL
);

CREATE TABLE characteristics_reviews_temp (
  id INT PRIMARY KEY,
  characteristic_id INT NOT NULL REFERENCES characteristics_temp(id),
  review_id INT NOT NULL REFERENCES reviews_temp(id),
  value INT NOT NULL
);

-- Copy data into a temporary characteristics table that we will use later to merge into Meta table
\COPY characteristics_temp FROM '/Users/jabrake/Downloads/characteristics.csv' DELIMITER ',' CSV HEADER;

-- Copy data into a temporary characteristics_reviews table that we will use later to merge into Meta table
\COPY characteristics_reviews_temp FROM '/Users/jabrake/Downloads/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;

-- META TABLE
CREATE TABLE meta (
  id INT PRIMARY KEY,
  product_id INT NOT NULL,
  ratings JSON NOT NULL,
  recommended JSON NOT NULL,
  characteristics JSON NOT NULL
);
