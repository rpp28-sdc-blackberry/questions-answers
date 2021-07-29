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
  await db.query(`INSERT INTO reviews (product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES (1, 5, current_timestamp, 'test summary', 'test body', true, false, 'test reviewer name', 'test reviewer email', 'test response', 16)`);
  // eslint-disable-next-line quotes
  await db.query(`INSERT INTO photos (review_id, url) VALUES (1, 'www.testurl.com')`);
  // eslint-disable-next-line quotes
  await db.query(`INSERT INTO characteristics (product_id, name) VALUES (1, 'test characteristic')`);
  await db.query('INSERT INTO characteristics_reviews (characteristic_id, review_id, value) VALUES (1, 1, 16)');
});

afterAll(async () => {
  await db.query('TRUNCATE reviews, photos, characteristics, characteristics_reviews');
  await db.end();
});

describe('GET requests to the /reviews endpoint', () => {
  it('should respond with 200', async () => {
    const response = await request.get('/reviews?product_id=2&page=1&count=4&sort=newest');
    expect(response.statusCode).toBe(200);
  });
});

describe('GET requests to the /reviews/meta endpoint', () => {
  it('should respond with 200', async () => {
    const response = await request.get('/reviews/meta?product_id=2');
    expect(response.statusCode).toBe(200);
  });
});

// describe('POST requests to the reviews endpoint', () => {
//   const review = {
//     product_id: 2,
//     rating: 4,
//     summary: 'my fave product',
//     body: 'it is the greatest thing EVER!',
//     recommend: true,
//     name: 'jorge',
//     email: 'jorge@gmail.com',
//     photos: ['www.google.com', 'www.hackreactor.com'],
//     characteristics: {
//       14: 99,
//       15: 99,
//     },
//   };

//   it('should respond with 201', async () => {
//     const response = await request.post('/reviews').send(review);
//     expect(response.statusCode).toBe(201);
//   });
// });

describe('PUT requests to the /helpful endpoint', () => {
  it('should respond with 204', async () => {
    const response = await request.put('/reviews/16/helpful');
    expect(response.statusCode).toBe(204);
  });
});

describe('PUT requests to the /report endpoint', () => {
  it('should respond with 204', async () => {
    const response = await request.put('/reviews/16/report');
    expect(response.statusCode).toBe(204);
  });
});
