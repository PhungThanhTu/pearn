var express = require('express');
var router = express.Router();
var userService = require('../services/users.services');
const {authorize} = require('../middlewares/auth.middleware')

/* GET users listing. */


router.post('/register',authorize, userService.register);



router.post('/login', userService.login);
router.post('/refresh',userService.refresh);
router.post('/admin',userService.oneTimeAdminRegister);
router.post('/password',authorize,userService.changeUserPassword);
router.put('/profile',authorize,userService.editProfile);
router.get('/profile',authorize,userService.getProfile);

module.exports = router;