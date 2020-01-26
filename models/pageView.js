const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  'page-id': 'string',
  'timestamp': 'number',
  'user-id': 'string',
  browser: 'string',
  country: 'string'
});

const PageView = mongoose.model('page-view', schema);

module.exports = PageView;