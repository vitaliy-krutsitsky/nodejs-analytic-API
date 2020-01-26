const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const useragent = require('express-useragent');
const { PageView } = require('../models');

router.use(bodyParser.json());
// since we have only one path in this router we should always use middle wares below
router.use(useragent.express());

router.post('/', async (req, res) => {
  const event = req.body;
  const browser = req.useragent.browser;
  const country = '';

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
    console.log(`Successfully saved event: ${JSON.stringify(eventData)}`);

    res.sendStatus(200);
  } catch (err) {
    console.error(`Error happened while saving eventData. ${err}`);
    res.sendStatus(500);
  }
});

module.exports = router;