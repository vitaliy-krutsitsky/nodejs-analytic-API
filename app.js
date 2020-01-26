const express = require('express');
const app = express();
const { stats, pageViews } = require('./routes');

app.use('/stats', stats);
app.use('/page-views', pageViews);

module.exports = app;
