const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const messageSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// messageSchema

/*

var crypto = require('crypto');
var assert = require('assert');

var algorithm = 'aes256'; // or any other algorithm supported by OpenSSL
var key = 'password';
var text = 'I love kittens';

var cipher = crypto.createCipher(algorithm, key);  
var encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
var decipher = crypto.createDecipher(algorithm, key);
var decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');

assert.equal(decrypted, text);
*/

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
