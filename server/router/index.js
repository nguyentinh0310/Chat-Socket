const router = require('express').Router()

const userRouter = require('./user')

router.use('/api/auth', userRouter)


module.exports= router

