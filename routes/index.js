const router = require('express').Router();

router.get('/', (req, res) => {
  res.status(200).json({ data: null, message: 'hello world!' });
});

module.exports = router;
