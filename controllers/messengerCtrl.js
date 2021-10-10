const Messenger = require('../model/messengerModel');

const messengerCtrl = {
  addMessage: async (req, res, next) => {
    try {
      const newMessage = await Messenger.create(req.body);

      res.status(201).json(newMessage);
    } catch (err) {
      next(err);
    }
  },
  getMessage: async (req, res, next) => {
    try {
      const message = await Messenger.find({
        conversationId: req.params.conversationId,
      });
      res.status(200).json(message);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = messengerCtrl;
