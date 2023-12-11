import { Options } from 'k6/options';
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options: Options = {
  thresholds: {
    http_req_failed: ['rate<0.01'], // http errors should be less than 1%
    http_req_duration: ['p(99)<2000'], // 99% of requests should be below 2s
  },
  stages: [
    { duration: '10s', target: 1000 }, // traffic ramp-up
    { duration: '30s', target: 1000 }, // sustained stress
    { duration: '5s', target: 0 }, // ramp-down
  ],
};

const randProductId = () => 900_000 + Math.floor((Math.random() * 100_000));

export default () => {
  const pId = randProductId();
  const urls = [
    `http://localhost:8080/qa/questions?product_id=${pId}`,
    `http://localhost:8080/qa/questions/${pId}/answers`,
  ];

  sleep(1);
  const res1 = http.get(urls[0], {
    tags: { name: 'GetRandProductQuestions' },
  });
  const res2 = http.get(urls[1], {
    tags: { name: 'GetRandQuestionAnswers' },
  });
  check(res1, {
    'response code was 200': (response) => response.status === 200,
  });
  check(res2, {
    'response code was 200': (response) => response.status === 200,
  });
};
