const mongoose = require('mongoose');

require('dotenv').config();

const URI = process.env.DB_URI;

const connectDB = () => {
  URI &&
    mongoose
      .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      })
      .then(() => {})
      .catch((error) => console.log(error));
};

module.exports = connectDB;
