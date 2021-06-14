const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const userCtrl = {
  resgister: async (req, res, next) => {
    try {
      const { username, fullname, password } = req.body;
      if (!username || !fullname || !password)
        return res
          .status(400)
          .json({ message: "Xin mời nhập tất cả các trường" });
      if (password.length < 6)
        return res
          .status(400)
          .json({ message: "Mật khẩu phải lớn hơn 6 ký tự" });

      const user = await User.findOne({ username });
      if (user)
        return res.status(400).json({ message: "username này đã tồn tại 😢" });
      const passwordHash = await bcrypt.hash(password, 10);

      const newUser = await User({
        username,
        fullname,
        password: passwordHash,
      });

      await newUser.save();

      res.status(201).json({
        message: "Đăng ký thành công ",
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
          .json({ message: "Xin mời nhập email hoặc mật khẩu 😢" });

      const user = await User.findOne({ username });
      if (!user)
        return res.status(400).json({ message: "Username không tồn tại 😢!" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Mật khẩu không đúng 😢!" });
      const refresh_token = createRefreshToken({ id: user._id }); // xét mã id
      res.cookie("refresh_token", refresh_token, {
        httpOnlly: true,
        path: "/api/auth/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
      });

      res.status(200).json({ message: "Đăng nhập thành công!", user });
    } catch (err) {
      next(err);
    }
  },
  getAccessToken: async (req, res, next) => {
    try {
      const rf_token = req.cookies.refresh_token;
      if (!rf_token)
        res.status(400).json({ message: "Đăng nhập ngay bây giờ" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          res.status(400).json({ message: "Hãy đăng nhập ngay bây giờ" });

        const access_token = createAccessToken({ id: user.id });

        res.status(200).json({ access_token });
      });
    } catch (err) {
      next(err);
    }
  },
  logOut: async (req, res, next) => {
    try {
      res.clearCookie("refresh_token", { path: "/api/auth/refresh_token" });
      res.status(200).json({ message: "Đăng xuất thành công" });
    } catch (err) {
      next(err);
    }
  },
  getAllInfo: async (req, res, next) => {
    try {
      try {
        const user = await User.find().select("-password");

        res.status(200).json({ user });
      } catch (err) {
        next(err);
      }
    } catch (err) {
      next(err);
    }
  },
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

module.exports = userCtrl;
