var mongoose = require('mongoose');

const dbURI = 'mongodb://localhost:27017/server_db';
var dbOptions = {
  // user: 'admin',
  // pass: 'admin',
};

mongoose.connect(dbURI, dbOptions);

mongoose.connection.on('connected', function() {
  console.info("Mongoose connected to: " + dbURI);
});

mongoose.connection.on('error', function() {
  console.info("Mongoose connection to: " + dbURI);
});

module.exports = mongoose;