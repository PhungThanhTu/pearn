var express = require('express');
var router = express.Router();
const { authorize } = require('../middlewares/auth.middleware');
const { createCourse, getCourse, httpDeleteCourse, httpCreateCourse, httpGetCourse, httpAddStudent, httpRemoveStudent, httpAddLecturer, httpRemoveLecturer } = require('../services/courses.service');


router.post('/',authorize("staff"),httpCreateCourse);
router.get('/:id',authorize,httpGetCourse);
router.delete('/:id',authorize,httpDeleteCourse);
router.post('/addStudent',authorize,httpAddStudent);
router.post('/deleteStudent',authorize,httpRemoveStudent);
router.post('/addLecturer',authorize,httpAddLecturer);
router.post('/removeLecturer',authorize,httpRemoveLecturer);

module.exports = router;
