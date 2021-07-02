const User = require('../model/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userCtrl = {
  resgister: async (req, res, next) => {
    try {
      const { username, fullname, password } = req.body;
      if (!username || !fullname || !password)
        return res.status(400).json({ success: false, message: 'Xin mời nhập tất cả các trường' });
      if (password.length < 6)
        return res.status(400).json({ success: false, message: 'Mật khẩu phải lớn hơn 6 ký tự' });

      const user = await User.findOne({ username });
      if (user)
        return res.status(400).json({ success: false, message: 'username này đã tồn tại 😢' });
      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await User({
        username,
        fullname,
        password: passwordHash,
      });

      await newUser.save();

      const accessToken = jwt.sign({ id: newUser._id }, process.env.ACCESS_TOKEN_SECRET);

      res.status(201).json({
        success: true,
        message: 'Đăng ký thành công ',
        accessToken,
      });
    } catch (err) {
      next(err);
    }
  },
  logIn: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const formatUsername = String(username).trim().toLowerCase();
      if (!formatUsername || !password)
        return res
          .status(400)
          .json({ success: false, message: 'Xin mời nhập email hoặc mật khẩu 😢' });

      const user = await User.findOne({ username });
      if (!user)
        return res.status(400).json({ success: false, message: 'Username không tồn tại 😢!' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Mật khẩu không đúng 😢!' });
   
      const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_TOKEN_SECRET);

      res.status(200).json({ success: true, message: 'Đăng nhập thành công!', accessToken });
    } catch (err) {
      next(err);
    }
  },

  getInfor: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select('-password');

      res.status(200).json({ success: true, user });
    } catch (err) {
      next(err);
    }
  },
  getAllInfo: async (req, res, next) => {
    try {
      try {
        const users = await User.find().select('-password');

        res.status(200).json({ success: true, users });
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(err);
    }
  },
  // get a user
  getAUser: async (req, res, next) => {
    try {
      const userId = req.query.userId;
      const username = req.query.username;

      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ username: username });
      //lấy các trường trong doc -> in ra nhưng trường còn lại trừ  password,updatedAt
      const { password, updatedAt, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      next(err);
    }
  },

};

module.exports = userCtrl;
