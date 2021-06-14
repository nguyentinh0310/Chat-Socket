var mongoose = require("mongoose");

var schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your name!"],
      trim: true,
    },
    fullname: {
      type: String,
      required: [true, "Please enter your fullname!"],
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Please enter your password!"],
      trim: true,
    },

    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dwgximj2j/image/upload/v1618798136/avatars/default-avatar_ay23oq.jpg",
    },
  },

);

var Users = mongoose.model("Users", schema, "users");

module.exports = Users;
