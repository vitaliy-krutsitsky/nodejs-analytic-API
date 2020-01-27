const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  'page-id': { type: String, default: '' },
  'timestamp': { type: Number, default: '' },
  'user-id': { type: String, default: '' },
  browser: String,
  country: String
});

const PageView = mongoose.model('page-view', schema);

module.exports = PageView;