// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.SECRET_KEY;

const auth = (permissions = []) => {
  return (req, res, next) => {
    try {
      const tokenObj  = req.signedCookies?.token || req.cookies?.token;
      const token     = tokenObj?.jwtToken;
      const userhandle = tokenObj?.userhandle; // ✅ Extract userhandle

      if (!token) {
        return res.status(401).json({ message: 'Login required' });
      }

      const decoded = jwt.verify(token, secret);

      req.user = {
        ...decoded,
        userhandle, // ✅ Now req.user.userhandle works in controller
      };

      if (permissions.length && !permissions.includes(req.user.role)) {
        return res.status(403).send("You don't have permission");
      }

      next();
    } catch (err) {
      return res.status(401).send('Invalid token');
    }
  };
};

module.exports = auth;