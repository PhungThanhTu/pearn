var express = require('express');
var router = express.Router();
var userService = require('../services/users.services');
const {authorize} = require('../middlewares/auth.middleware')

/* GET users listing. */


router.post('/register',authorize("admin"), userService.register);
router.post('/login', userService.login);
router.post('/refresh',userService.refresh);
router.post('/admin',userService.oneTimeAdminRegister);
router.post('/password',authorize(undefined),userService.changeUserPassword);
router.put('/profile',authorize(undefined),userService.editProfile);
router.get('/profile',authorize(undefined),userService.getProfile);

module.exports = router;