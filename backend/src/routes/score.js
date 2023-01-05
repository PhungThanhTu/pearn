var express = require('express');
const { authorize } = require('../middlewares/auth.middleware');
const { httpSetWeight, httpSubmitExercise, httpGetSubmissionById, httpGetAllSubmissionByBlock, httpGradeSubmission, httpGetCourseScoreOfStudent, httpGetAllStudentScoreInCourse, httpGetWeight } = require('../services/score.service');
var router = express.Router();


router.patch('/weight/:blockId',authorize("lecturer"),httpSetWeight);
router.get('/weight/:blockId',authorize("lecturer"),httpGetWeight);
router.post('/:id',authorize("lecturer"),httpGradeSubmission);
router.post('/submit/:blockId',authorize("student"),httpSubmitExercise);
router.get('/submit/:id',authorize(undefined),httpGetSubmissionById);
router.get('/submits/:blockId',authorize("lecturer"),httpGetAllSubmissionByBlock);
router.get('/sum/:courseId/:username',authorize("lecturer"),httpGetCourseScoreOfStudent);
router.get('/sumAll/:courseId',authorize("lecturer"),httpGetAllStudentScoreInCourse);

module.exports = router;
