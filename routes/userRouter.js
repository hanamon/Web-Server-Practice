const router = require('express').Router();
const { userControllers } = require('../controllers');

router.post('/signin', userControllers.signin);
router.get('/userinfo', userControllers.userinfo);

module.exports = router;
