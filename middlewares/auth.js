const jwt = require("jsonwebtoken");

const authenticatedMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Không được phép vì trống authorization" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ message: "Mã token hết hạn" });

      req.user = user;
      next();
    });
  } catch (err) {
    next(err);
  }
};

module.exports= authenticatedMiddleware