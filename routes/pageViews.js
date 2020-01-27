const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
const geoip = require('geoip-lite');
const { PageView } = require('../models');
const logger = require('../services/logger');
const { getEndpointsMiddleware } = require('../middleware');

//do not use geoip and useragent as a middleware, because we need this info only for post request
router.use(bodyParser.json());
router.use(getEndpointsMiddleware);

router.post('/', async (req, res) => {
  const event = req.body;

  const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const geo = geoip.lookup(clientIp);
  const country = geo ? geo.country : '';

  const { browser } = useragent.parse(req.headers['user-agent']);

  const eventData = {
    'page-id': event['page-id'],
    'timestamp': event['timestamp'],
    'user-id': event['user-id'],
    browser,
    country
  };

  const pageView = new PageView(eventData);

  const validationError = pageView.validateSync();
  if (validationError) {
    return res.status(400).send('Page view has incorrect schema');
  }

  try {
    await pageView.save();
    logger.info(`Successfully saved event: ${JSON.stringify(eventData)}`);

    res.sendStatus(200);
  } catch (err) {
    logger.error(`Error happened while saving eventData. ${err}`);
    res.sendStatus(500);
  }
});

router.get('/by-user/:userId', async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send('userId is required');
  }

  try {
    const viewsStream = PageView.find({ 'user-id': userId }).cursor({ transform: JSON.stringify });
    viewsStream.pipe(res.type('json'));

  } catch (err) {
    logger.error(`Error happened while getting page views by userId ${userId}. ${err}`);
    res.sendStatus(500);
  }
});

router.get('/by-country/:country', async (req, res) => {
  const { country } = req.params;
  if (!country) {
    return res.status(400).send('country is required');
  }

  try {
    const viewsStream = PageView.find({ 'country': country }).cursor({ transform: JSON.stringify });
    viewsStream.pipe(res.type('json'));

  } catch (err) {
    logger.error(`Error happened while getting page views by country ${country}. ${err}`);
    res.sendStatus(500);
  }
});

router.get('/by-browser/:browser', async (req, res) => {
  const { browser } = req.params;
  if (!browser) {
    return res.status(400).send('browser is required');
  }

  try {
    const viewsStream = PageView.find({ 'browser': browser }).cursor({ transform: JSON.stringify });
    viewsStream.pipe(res.type('json'));

  } catch (err) {
    logger.error(`Error happened while getting page views by browser ${browser}. ${err}`);
    res.sendStatus(500);
  }
});

router.get('/returning-users-rate', async (req, res) => {
  try {
    const uniqueCount = (await PageView.aggregate([
      { $group: { _id: '$user-id' } },
      { $group: { _id: 1, count: { $sum: 1 } } }
    ]))[0].count;

    const visitedCount = (await PageView.aggregate([
      { $group: { "_id": "$user-id", "count": { $sum: 1 } } },
      { $match: { "count": { $gt: 1 } } },
      { $count: 'count' }
    ]))[0].count;

    const rate = uniqueCount ? visitedCount / uniqueCount : 0;

    res.json({ rate });

  } catch (err) {
    logger.error(`Error happened while getting returning-users-rate. ${err.stack}`);
    res.sendStatus(500);
  }
});

module.exports = router;