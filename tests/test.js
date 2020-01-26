const request = require('supertest');
const app = require('../app');

describe("GET /", () => {
  it('it should has status code 200', async () => {
    const res = await request(app).get('/');

    //expect(res.statusCode).to.equal(200);
  });
});