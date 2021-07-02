const router = require('express').Router();
const conversationCtrl = require('../controllers/conversationCtrl');
const authenticatedMiddleware = require('../middlewares/auth');

router.post('/',authenticatedMiddleware, conversationCtrl.newConversation);

router.get('/:userId', authenticatedMiddleware,conversationCtrl.getConversation);

module.exports = router;
