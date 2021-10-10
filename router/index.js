const router = require('express').Router()

const userRouter = require('./user')
const conversationRouter = require('./coversation')
const messageRouter = require('./message')

router.use('/api/auth', userRouter)
router.use('/api/conversation', conversationRouter)
router.use('/api/message', messageRouter)


module.exports= router

