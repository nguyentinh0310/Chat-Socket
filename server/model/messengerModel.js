const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
  },
  { timestamps: true }
);

const Messenger = mongoose.model('Messenger', schema, 'messenger');

module.exports = Messenger;
