  
const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Conversation= mongoose.model("Conversation", schema,'conversation');

module.exports = Conversation