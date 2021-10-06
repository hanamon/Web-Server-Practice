const router = require('express').Router();
const { postControllers } = require('../controllers');

router.get('/', postControllers.findAll);
router.get('/:postId', postControllers.findById);

module.exports = router;
