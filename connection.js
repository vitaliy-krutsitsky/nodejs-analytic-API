const mongoose = require("mongoose");
require('./models'); // important to register all needed models
const config = require('./config');
const connectionString = `mongodb://${config.db.server}:${config.db.port}/${config.db.dbName}`;

const connectDb = () => mongoose.connect(connectionString, {
  autoIndex: false, useNewUrlParser: true, useUnifiedTopology: true
});

module.exports = connectDb;