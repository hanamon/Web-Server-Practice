const router = require('express').Router();
const { postControllers } = require('../controllers');

router.get('/', postControllers.get);

module.exports = router;
