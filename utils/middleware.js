const jwt = require("../utils/jwt");

const isAuth = (req, res, next) => {
  try {
    const cookie = req.cookies.token
    const verifyToken = jwt.verify(cookie);
    if (!verifyToken) {
      return res.status(403).json({message: 'Invalid token}'})
    }
    next()
  } catch (error) {
    res.status(500).json({
      message: error.message,
    })
  }
};

module.exports = isAuth;
