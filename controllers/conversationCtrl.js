const Conversation = require('../model/conversationModel');

const conversationCtrl = {
  newConversation: async (req, res, next) => {
    try {
      const newCnv = new Conversation({
        members: [req.body.sendId, req.body.receiveId], //tương ứng userId1, userId2
      });
      const saveCnv = await newCnv.save();
      res.status(200).json(saveCnv);
    } catch (err) {
      next(err);
    }
  },
  //  lấy cuộc trò chuyện của một người dùng
  getConversation: async (req, res, next) => {
    try {
      const conversation = await Conversation.find({
        // $in trả về các document trong đó giá trị nằm trong mảng được chỉ định
        members: { $in: [req.params.userId] },
      });
      res.status(200).json(conversation);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = conversationCtrl;
