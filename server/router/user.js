const router = require('express').Router()
const userCtrl = require('../controllers/userCtrl')


router.post('/register', userCtrl.resgister)

router.post('/login', userCtrl.logIn)

router.post('/refresh_token', userCtrl.getAccessToken)

router.get('/logout', userCtrl.logOut)


router.get('/', userCtrl.getAllInfo)


module.exports = router 