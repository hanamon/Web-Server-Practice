const bcrypt = require('bcrypt');
const { user } = require('../models');
const { Op } = require('sequelize');
const { generateAccessToken, sendAccessToken } = require('./tokenFunction');
const userAuthen = require('./authentication/userAuthen');

module.exports = {
  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // 요청이 잘못된 경우
      if (!email, !password) return res.status(400).json({ data: null, message: 'Bad Request!' });

      // 등록된 회원이 존재하는지 확인한다.
      const userInfo = await user.findOne({ where: { user_email: email } });  
      if( !userInfo ) return res.status(401).json({ data: null, message: 'Not authorized!' });

      // 등록된 회원이 존재한다면 비밀번호를 확인한다.
      const match = await bcrypt.compare(password, userInfo.dataValues.user_password);
      if( !match ) return res.status(401).json({ data: null, message: 'Not authorized!' });

      // 회원의 비밀 번호를 삭제한다.
      delete userInfo.dataValues.user_password;

      // 토큰을 발급하고 쿠키에 저장한다.
      const accessToken = generateAccessToken(userInfo.dataValues);
      sendAccessToken(res, accessToken);

      // 회원 정보를 반환한다.
      res.status(200).json({ data: { userInfo }, message: 'ok' });
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ data: null, message: 'Server error!' });
    }
  }
}
