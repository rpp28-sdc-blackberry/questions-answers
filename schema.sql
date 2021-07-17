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
  response TEXT,
  body TEXT NOT NULL,
  date TIMESTAMP NOT NULL,
  reviewer_name VARCHAR (255) NOT NULL,
  reviewer_email VARCHAR (255) NOT NULL,
  helpfulness INT NOT NULL,
  photos JSON[] NOT NULL
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
--   (1, 28212, 5, 'This product was great!', true, false, '', 'I really did or did not like this product based on whether it was sustainably sourced. Then I found out that its made from nothing at all.', '2019-01-01T00:00:00.000Z', 'funtime', 'funtime@aol.com', 8, ARRAY['{ "id": "731061", "url": "https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80"}', '{"id": "731062", "url": "https://images.unsplash.com/photo-1561693532-9ff59442a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80" }', '{ "id": "731063", "url": "https://images.unsplash.com/photo-1487349384428-12b47aca925e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80" }']::json[]);
