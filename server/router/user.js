const router = require('express').Router();
const userCtrl = require('../controllers/userCtrl');
const authenticatedMiddleware = require('../middlewares/auth');

router.post('/register', userCtrl.resgister);

router.post('/login', userCtrl.logIn);

router.get('/infor', authenticatedMiddleware, userCtrl.getInfor);

// /auth?userId=12345 || /auth?username=abc
router.get('/',authenticatedMiddleware, userCtrl.getAUser);

router.get('/all',authenticatedMiddleware, userCtrl.getAllInfo);


module.exports = router;
