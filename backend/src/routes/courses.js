var express = require('express');
var router = express.Router();
const { authorize } = require('../middlewares/auth.middleware');
const { createCourse, getCourse } = require('../services/courses.service');


router.post('/', authorize,createCourse);
router.get('/:id',authorize,getCourse);


module.exports = router;
