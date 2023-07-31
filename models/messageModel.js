const mongoose = require('mongoose');
const crypto = require('crypto');

const messageSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Message must have a recipient'],
    },
    sender: {
      type: String,
      ref: 'User',
      required: [true, 'Message must have a sender'],
    },
    message: {
      type: String,
      required: [true, 'Message must have content'],
    },
    reported: {
      status: { type: Boolean, default: false },
      reportedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      reportReason: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// creating index to enable search
messageSchema.index({ message: 'text' });

// DOCUMENT MIDDLEWARE
messageSchema.pre('save', function (next) {
  if (!this.isNew) {
    return next();
  }
  this.sender = crypto.createHash('sha256').update(this.sender).digest('hex');
  next();
});

messageSchema.pre(/^find/, function (next) {
  this.populate({ path: 'recipient', select: 'name photo' }).populate({
    path: 'reported.reportedBy',
    select: 'name',
  });
  next();
});

// MONGOOSE METHODS

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
