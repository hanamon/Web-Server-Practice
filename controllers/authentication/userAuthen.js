const { checkAccessToken } = require('../tokenFunction');
const { user } = require('../../models');

module.exports = async (req, res) => {
  try {
    // 쿠키에 에세스 토큰이 있는지 확인한다.
    const { accessToken } = req.cookies;
    if( !accessToken ) return res.status(403).json({ "data": null, "message": "Invalid access token!" });
    
    // 에세스 토큰이 유효한지 확인한다.
    const accessTokenData = checkAccessToken(accessToken);
    if( !accessTokenData ) return res.status(403).json({ "data": null, "message": "Invalid access token!" });
    
    // 에세스 토큰 정보가 유효한지 확인한다.
    const { user_login } = accessTokenData;
    const userInfo = await user.findOne({ where: { user_login } });
    if( !userInfo ) return res.status(401).json({ "data": null, "message": "Not authorized!" });

    // 에세스 유효하거나 권한이 있는 경우 사용자 정보를 리턴한다.
    return userInfo;
  }
  catch (err) {
    return res.status(500).json({ data: null, message: 'Server error!' });
  }
};
