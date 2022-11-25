var express = require('express');
var router = express.Router();
const { authorize } = require('../middlewares/auth.middleware')

/* GET users listing. */
router.get('/', authorize, function (req, res, next) {
  res.send(req.user);
});


module.exports = router;
