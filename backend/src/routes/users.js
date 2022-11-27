var express = require('express');
var router = express.Router();
const { authorize } = require('../middlewares/auth.middleware');
const { getAllUsers } = require('../services/users.services');

/* GET users listing. */
router.get('/', authorize, getAllUsers);


module.exports = router;
