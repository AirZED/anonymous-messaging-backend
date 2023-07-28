const mongoose = require('mongoose');

const blackListSchema = new mongoose.Schema(
  {
    reportedUser: {
      type: String,
      required: [true, 'Blacklisted message must have an user id'],
    },
  },
  { timestamps: true },
);

const BlackList = mongoose.model('BlackList', blackListSchema);
module.exports = BlackList;
