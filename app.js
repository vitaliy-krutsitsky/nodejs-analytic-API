const express = require('express');
const app = express();
const { pageViews } = require('./routes');

app.use('/page-views', pageViews);

module.exports = app;
