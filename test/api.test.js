/* eslint-disable consistent-return */
const request = require('supertest');

const app = require('../src/app');

describe('GET /api/v1', () => {
  it('responds with a json message', (done) => {
    request(app)
      .get('/api/v1')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(
        200,
        {
          message: 'API - Working',
        },
        done
      );
  });
});

describe('GET /api/v1/todos', () => {
  it('responds with a json array', (done) =>
    request(app)
      .get('/api/v1/todos')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(() => done())
      .catch((err) => done(err)));
});
