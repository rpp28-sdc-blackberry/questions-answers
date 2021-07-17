DROP TABLE IF EXISTS meta;
DROP TABLE IF EXISTS photos;
DROP TABLE IF EXISTS reviews;

CREATE TABLE reviews (
  id INT PRIMARY KEY,
  product_id INT NOT NULL,
  rating INT NOT NULL,
  summary VARCHAR (255) NOT NULL,
  recommend BOOLEAN NOT NULL,
  reported BOOLEAN NOT NULL,
  response VARCHAR (1000) NOT NULL,
  body TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  reviewer_name VARCHAR (255) NOT NULL,
  reviewer_email VARCHAR (255) NOT NULL,
  helpfulness INT NOT NULL
);

CREATE TABLE photos (
  id INT PRIMARY KEY,
  review_id INT NOT NULL REFERENCES reviews(id),
  url TEXT NOT NULL
);

CREATE TABLE meta (
  id INT PRIMARY KEY,
  product_id INT NOT NULL,
  ratings JSON NOT NULL,
  recommended JSON NOT NULL,
  characteristics JSON NOT NULL
);

\COPY reviews FROM '/Users/jabrake/Downloads/test_reviews.csv' DELIMITER ',' CSV HEADER;

\COPY meta FROM '/Users/jabrake/Downloads/test_meta.csv' DELIMITER ',' CSV HEADER;

\COPY photos FROM '/Users/jabrake/Downloads/test_photos.csv' DELIMITER ',' CSV HEADER;

-- INSERT INTO reviews VALUES
--   (1, 28212, 5, 'This product was great!', true, false, '', 'I really did or did not like this product based on whether it was sustainably sourced. Then I found out that its made from nothing at all.', '2019-01-01T00:00:00.000Z', 'funtime', 'funtime@aol.com', 8);

-- INSERT INTO photos VALUES
--   (1, 1, 'https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80');

-- INSERT INTO meta VALUES
--   (1, 28212, '{ "2": "1", "3": "1", "4": "2" }', '{ "false": "5", "true": "2" }', '{ "Quality": { "id": "94615", "value": "4.2000000000000000" } }');