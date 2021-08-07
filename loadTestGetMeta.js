const { check, sleep } = require('k6');
const http = require('k6/http');
const { Rate } = require('k6/metrics');

export const errorRate = new Rate('GET /meta error rate');

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
  const url = 'http://localhost:3000/reviews/meta?product_id=1000000';

  check(http.get(url), {
    'status is 200': (r) => r.status == 200,
  }) || errorRate.add(1);
  sleep(1);
}
