const router = require('express').Router()
const messengerCtrl = require('../controllers/messengerCtrl')
const authenticatedMiddleware= require('../middlewares/auth')

router.get("/:conversationId",authenticatedMiddleware, messengerCtrl.getMessage)

router.post('/',authenticatedMiddleware, messengerCtrl.addMessage)


module.exports = router 