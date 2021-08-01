const supertest = require('supertest');
const app = require('../server/server');
const db = require('../db/index');

const request = supertest(app);

jest.setTimeout(25 * 1000);

beforeAll(async () => {
  await db.query('ALTER SEQUENCE reviews_id_seq RESTART');
  await db.query('ALTER SEQUENCE photos_id_seq RESTART');
  await db.query('ALTER SEQUENCE characteristics_id_seq RESTART');
  await db.query('ALTER SEQUENCE characteristics_reviews_id_seq RESTART');

  // eslint-disable-next-line quotes
  await db.query(`INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES (1, 5, current_timestamp, 'test summary', 'test body', true, false, 'test reviewer name', 'test reviewer email', 'test response', 1)`);
  // eslint-disable-next-line quotes
  await db.query(`INSERT INTO photos (review_id, url) VALUES (1, 'www.testurl.com')`);
  // eslint-disable-next-line quotes
  await db.query(`INSERT INTO characteristics (product_id, name) VALUES (1, 'test characteristic')`);
  await db.query('INSERT INTO characteristics_reviews (characteristic_id, review_id, value) VALUES (1, 1, 1)');
});

afterAll(async () => {
  await db.query('TRUNCATE reviews, photos, characteristics, characteristics_reviews');
  await db.end();
});

describe('GET requests to the /reviews endpoint', () => {
  it('should respond with 200 and return one review', async () => {
    const response = await request.get('/reviews?product_id=1&page=1&count=1&sort=newest');
    const reviews = response.body.results;

    expect(response.statusCode).toBe(200);
    expect(response.body.product).toEqual(1);
    expect(response.body.page).toEqual(1);
    expect(response.body.count).toEqual(1);

    expect(reviews.length).toEqual(1);
    expect(reviews[0].id).toEqual(1);
  });
});

describe('GET requests to the /reviews/meta endpoint', () => {
  it('should respond with 200', async () => {
    const response = await request.get('/reviews/meta?product_id=1');
    expect(response.statusCode).toBe(200);
    expect(response.body.product_id).toEqual(1);
  });
});

describe('POST requests to the reviews endpoint', () => {
  const review = {
    product_id: 1,
    rating: 4,
    summary: 'my fave product',
    body: 'it is the greatest thing EVER!',
    recommend: true,
    name: 'jorge',
    email: 'jorge@gmail.com',
    photos: ['www.google.com', 'www.hackreactor.com'],
    characteristics: {
      1: 4,
    },
  };

  it('should respond with 201 and two reviews', async () => {
    const postResponse = await request.post('/reviews').send(review);
    expect(postResponse.statusCode).toBe(201);

    const getResponse = await request.get('/reviews?product_id=1');
    const reviews = getResponse.body.results;
    expect(reviews.length).toEqual(2);
    expect(reviews[1].id).toEqual(2);
  });
});

describe('PUT requests to the /helpful endpoint', () => {
  it('should respond with 204', async () => {
    const reviewId = 1;
    let getResponse = await db.query(`SELECT helpfulness FROM reviews WHERE id = ${reviewId}`);
    let helpfulness = getResponse.rows[0].helpfulness;
    expect(helpfulness).toEqual(1);

    const putResponse = await request.put(`/reviews/${reviewId}/helpful`);
    getResponse = await db.query(`SELECT helpfulness FROM reviews WHERE id = ${reviewId}`);
    helpfulness = getResponse.rows[0].helpfulness;
    expect(putResponse.statusCode).toBe(204);
    expect(helpfulness).toEqual(2);
  });
});

describe('PUT requests to the /report endpoint', () => {
  it('should respond with 204', async () => {
    const reviewId = 1;
    let getResponse = await db.query(`SELECT reported FROM reviews WHERE id = ${reviewId}`);
    let reported = getResponse.rows[0].reported;
    expect(reported).toBe(false);

    const putResponse = await request.put(`/reviews/${reviewId}/report`);
    getResponse = await db.query(`SELECT reported FROM reviews WHERE id = ${reviewId}`);
    reported = getResponse.rows[0].reported;
    expect(putResponse.statusCode).toBe(204);
    expect(reported).toBe(true);
  });
});
