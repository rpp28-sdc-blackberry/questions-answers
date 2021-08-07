const { check, sleep } = require('k6');
const http = require('k6/http');
const { Rate } = require('k6/metrics');

export const errorRate = new Rate('POST /reviews error rate');

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1100,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: '30s',
      preAllocatedVUs: 100, // how large the initial pool of VUs would be
      maxVUs: 1300, // if the preAllocatedVUs are not enough, we can initialize more
    },
  },
};

export default function () {
  const url = 'http://localhost:3000/reviews';

  const data = JSON.stringify({
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
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  check(http.post(url, data, params), {
    'status is 201': (r) => r.status == 201,
  }) || errorRate.add(1);
  sleep(1);
}
