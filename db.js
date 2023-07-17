const mongoose = require('mongoose');

const DB_STRING = process.env.DB_URL.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD,
);

const db = async () => {
  try {
    await mongoose.connect(DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('DB connection successful');
  } catch (error) {
    console.error('DB connected failed :', error);
  }
};

module.exports = db;
