var express = require('express');
var router = express.Router();
const { authorize } = require('../middlewares/auth.middleware');
const { httpDeleteCourse, httpCreateCourse, httpGetCourse, httpAddStudent, httpRemoveStudent, httpAddLecturer, httpRemoveLecturer, httpGetCourses } = require('../services/courses.service');
const { httpRateCourse, httpGetAverageStar } = require('../services/rating.service');


router.post('/',authorize("staff"),httpCreateCourse);
router.get('/:id',authorize(undefined),httpGetCourse);
router.get('/',authorize(undefined),httpGetCourses);
router.delete('/:id',authorize("staff"),httpDeleteCourse);
router.post('/addStudent',authorize("staff"),httpAddStudent);
router.post('/deleteStudent',authorize("staff"),httpRemoveStudent);
router.post('/addLecturer',authorize("staff"),httpAddLecturer);
router.post('/removeLecturer',authorize("staff"),httpRemoveLecturer);
router.post('/rate/:courseId',authorize(undefined),httpRateCourse);
router.get('/rate/:courseId',authorize(undefined),httpGetAverageStar);

module.exports = router;

