const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    id_user1: {
      type: String,
      require: true,
    },
    id_user2: {
      type: String,
      require: true,
    },
    content: Array,
  },
  {
    timestamps: true,
  }
);

const Messenger = mongoose.model('Messenger', schema, 'messenger');

module.exports = Messenger;
