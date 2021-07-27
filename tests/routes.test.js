const supertest = require('supertest');
const app = require('../server/server');
const db = require('../db/index');

const request = supertest(app);

jest.setTimeout(25 * 1000);

afterAll(async () => {
  db.end();
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

describe('POST requests to the reviews endpoint', () => {
  const review = {
    product_id: 2,
    rating: 4,
    summary: 'my fave product',
    body: 'it is the greatest thing EVER!',
    recommend: true,
    name: 'jorge',
    email: 'jorge@gmail.com',
    photos: ['www.google.com', 'www.hackreactor.com'],
    characteristics: {
      14: 99,
      15: 99,
    },
  };

  it('should respond with 201', async () => {
    const response = await request.post('/reviews').send(review);
    expect(response.statusCode).toBe(201);
  });
});

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
