const router = require('express').Router();
const { userControllers } = require('../controllers');

router.post('/signin', userControllers.signin);

module.exports = router;
