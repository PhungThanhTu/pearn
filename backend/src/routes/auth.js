var express = require('express');
var router = express.Router();
var userService = require('../services/users.services')

/* GET users listing. */
router.post('/register', userService.register);
router.post('/login', userService.login);
router.post('/refresh',userService.refresh);

module.exports = router;