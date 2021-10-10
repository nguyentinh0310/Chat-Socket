var mongoose = require('mongoose');

var schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please enter your name!'],
      trim: true,
    },
    fullname: {
      type: String,
      required: [true, 'Please enter your fullname!'],
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Please enter your password!'],
      trim: true,
    },

    avatar: {
      type: String,
      default:
        'https://res.cloudinary.com/dwgximj2j/image/upload/v1625042024/avatars/avatars-000909739588-ipll9u-t240x240_nxkecz.jpg',
    },
  },
  { timestamps: true }
);

var Users = mongoose.model('Users', schema, 'users');

module.exports = Users;
