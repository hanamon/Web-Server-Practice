require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = {
  generateAccessToken: (data) => {
    return jwt.sign(data, process.env.ACCESS_SECRET, { expiresIn: '1h' });
  },
  sendAccessToken: (res, accessToken) => {
    res.cookie('accessToken', accessToken, { httpOnly: true });
  }
};
