const supertest = require('supertest');
const app = require('../server/server');

const request = supertest(app);

describe('GET requests to the reviews endpoint', () => {
  it('respond with 200', (done) => {
    request
    // request('http://localhost:3000')
      .get('/reviews')
      .expect(200, done);
  });
});

describe('GET requests to the meta endpoint', () => {
  it('respond with 200', (done) => {
    request
    // request('http://localhost:3000')
      .get('/reviews/meta')
      .expect(200, done);
  });
});

describe('POST requests to the reviews endpoint', () => {
  it('respond with 201', (done) => {
    request
    // request('http://localhost:3000')
      .post('/reviews')
      .expect(201, done);
  });
});

describe('PUT requests to the helpful endpoint', () => {
  it('respond with 204', (done) => {
    request
    // request('http://localhost:3000')
      .put('/reviews/16/helpful')
      .expect(204, done);
  });
});

describe('PUT requests to the report endpoint', () => {
  it('respond with 204', (done) => {
    request
    // request('http://localhost:3000')
      .put('/reviews/16/report')
      .expect(204, done);
  });
});
