var express = require('express');
var router = express.Router();
const { authorize } = require('../middlewares/auth.middleware');
const { getAllUsers, getAllLecturers, getAllStudents } = require('../services/users.services');

/* GET users listing. */
router.get('/', authorize("admin"), getAllUsers);
router.get('/lecturer',authorize("staff"),getAllLecturers);
router.get('/student',authorize("staff"),getAllStudents);


module.exports = router;
