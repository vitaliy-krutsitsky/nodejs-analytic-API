const express = require('express');
const router = express.Router();
const { getEndpointsMiddleware } = require('../middleware');
const { PageView } = require('../models');

//Middle ware that is specific to this router
router.use(getEndpointsMiddleware);

router.get('/page-views/by-user/:userId', async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    return res.status(400).send('userId is required');
  }

  try {
    const views = await PageView.find({ 'user-id': userId });
    res.json(views);

  } catch (err) {
    console.error(`Error happened while getting page views by userId ${userId}. ${err}`);
    res.sendStatus(500);
  }
});

router.get('/page-views/by-country/:country', async (req, res) => {
  const { country } = req.params;
  if (!country) {
    return res.status(400).send('country is required');
  }

  try {
    const views = await await PageView.find({ 'country': country });
    res.json(views);

  } catch (err) {
    console.error(`Error happened while getting page views by country ${country}. ${err}`);
    res.sendStatus(500);
  }
});

router.get('/page-views/by-browser/:browser', async (req, res) => {
  const { browser } = req.params;
  if (!browser) {
    return res.status(400).send('browser is required');
  }

  try {
    const views = await await PageView.find({ 'browser': browser });
    res.json(views);

  } catch (err) {
    console.error(`Error happened while getting page views by browser ${browser}. ${err}`);
    res.sendStatus(500);
  }
});

router.get('/page-views/returning-users-rate', async (req, res) => {
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
    console.error(`Error happened while getting returning-users-rate. ${err.stack}`);
    res.sendStatus(500);
  }
});


module.exports = router;