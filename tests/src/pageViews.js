const request = require('supertest');
const app = require('../../app');
const { describe } = require('mocha');
const { assert } = require('chai');
const sinon = require('sinon');
const useragent = require('express-useragent');
const geoip = require('geoip-lite');
const { PageView } = require('../../models');
const logger = require('../../services/logger');
const conf = require('../../config');

describe('/page-views', () => {
  before(() => {
    // no need to show logger info while testing
    sinon.stub(logger, 'info');
    sinon.stub(logger, 'error');
  });

  after(() => {
    logger.info.restore();
    logger.error.restore();
  });

  describe('POST /', () => {
    const browser = 'Chrome';
    const country = 'USA';

    beforeEach(() => {
      sinon.stub(useragent, 'parse').returns({ browser });
      sinon.stub(geoip, 'lookup').returns({ country });
      sinon.stub(PageView.prototype, 'save').resolves(true);
    });

    afterEach(() => {
      PageView.prototype.save.restore();
      useragent.parse.restore();
      geoip.lookup.restore();
    });

    it('it should save pave-view event to db and sent 200 status code', async () => {
      const requestData = { 'user-id': 'user_1', 'page-id': 'home', 'timestamp': 123456789 };

      const res = await request(app)
        .post('/page-views')
        .set('Content-Type', 'application/json')
        .send(JSON.stringify(requestData));

      assert(PageView.prototype.save.called, 'save method was not called');
      assert(res.statusCode === 200, 'status code is not 200');
    });
  });

  [
    { prop: 'user-id', path: 'by-user', value: 'user_1' },
    { prop: 'browser', path: 'by-browser', value: 'Chrome' },
    { prop: 'country', path: 'by-country', value: 'US' },
  ].forEach(({ prop, value, path }) => {

    describe(`GET /${path}/${prop}`, () => {
      before(() => {
        // possible improvements: stub stream to send mock data and then check this data in assert
        sinon.stub(PageView, 'find').returns({ cursor: () => ({ pipe: (res) => { res.end(); } }) });
      });

      after(() => {
        PageView.find.restore();
      });

      it('should perform needed query and respond with 200 status code', async () => {
        const res = await request(app)
          .get(`/page-views/${path}/${value}`)
          .set('authorization', conf.auth.tokenGET);

        assert(res.statusCode === 200, 'status code is not 200');
        assert(PageView.find.calledWithExactly({ [prop]: value }), 'find called with wrong params');
      });
    });
  });
});