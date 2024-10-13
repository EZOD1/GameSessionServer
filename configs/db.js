require("dotenv").config();
var mongoose = require('mongoose');
const dbURI = (process.env.MONGODB_URI);

mongoose.connect(dbURI);

mongoose.connection.on('connected', function() {
  console.info("Mongoose connected to: " + dbURI);
});

mongoose.connection.on('error', function() {
  console.info("Mongoose connection to: " + dbURI);
});

module.exports = mongoose;