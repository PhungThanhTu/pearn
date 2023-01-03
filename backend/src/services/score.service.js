const { handleOk, handleBadRequest, handleNotFound } = require("../lib/responseMessage");
const { getBlockById } = require("../models/block.model");
const { findCourse } = require("../models/courses.model");
const { setWeightForBlock, getWeightOfBlock, getSumWeight } = require("../models/scoreMetadata.model");
const { submit, getSubmission, getAllSubmissionByBlock, gradeSubmission, getSumScore, getAllScoreByCourse } = require("../models/submission.model");
const { populateUserWithUsername } = require("../models/users.model");


module.exports = {
    httpSetWeight: async (req,res) => {
        const blockId = req.params.blockId;

        const weight = req.body.weight;

        const foundBlock = await getBlockById(blockId);

        if(!foundBlock) return handleNotFound(res,"Block not found");
        console.log(weight);
        console.log(`${weight} is ${isNaN(weight) ? '' : 'not'} a number`);
        if(isNaN(weight)) return handleBadRequest(res,"Invalid input");

        const result = await setWeightForBlock(blockId,weight);

        return handleOk(res,result);
    },
    httpGetCourseScoreOfStudent: async (req,res) => {
        const student = req.params.username;
        const courseId = req.params.courseId;

        const foundStudent = await populateUserWithUsername(student);
        const foundCourse = await findCourse(courseId);

        if(!foundCourse || !foundStudent) return handleNotFound(res,"Not found");

        const sumOverall = await getSumScore(student,courseId);
        const sumWeight = await getSumWeight(courseId);

        const totalScore = sumOverall/sumWeight;

        return handleOk(res,totalScore);
    },
    httpGradeSubmission: async (req,res) => {
        const submissionId = req.params.id;

        const score = req.body.score;

        if(isNaN(score) || score < 0 || score > 10) return handleBadRequest(res,"Invalid Input");

        const foundSumission = await getSubmission(submissionId);

        if(!foundSumission) handleNotFound(res,"Not found");

        const blockId = foundSumission.block;

        const weight = await getWeightOfBlock(blockId);


        const result = await gradeSubmission(submissionId,score,weight);
        return handleOk(res,result);
    },
    httpGetAllSubmissionByBlock: async (req,res) => {
        const blockId = req.params.blockId;

        const result = await getAllSubmissionByBlock(blockId);
        if(!result) return handleNotFound(res,"Not found");

        return handleOk(res,result);
    },
    httpSubmitExercise: async (req,res) => {
        const studentUsername = req.user.username;

        const blockId = req.params.blockId;

        const foundBlock = await getBlockById(blockId);

        console.log(foundBlock);

        const courseId = foundBlock.course;

        if(!foundBlock.course) return handleNotFound(res,"Block not found");

        const submitContent = req.body.markdown;

        const type = "markdown";

        const result = await submit(foundBlock._id,courseId,studentUsername,type,submitContent);

        return handleOk(res,result);

    },
    httpGetSubmissionById: async (req,res) => {
        const result = await getSubmission(req.params.id);
        if(!result) return handleNotFound(res,"Not found");
        return handleOk(res,result);
    },
    httpGetAllStudentScoreInCourse: async (req,res) => {
        
        const courseId = req.params.courseId;

        const result = await getAllScoreByCourse(courseId);

        return handleOk(res,result);
    },
    httpGetWeight: async (req,res) => {
        const blockId = req.params.blockId;

        const foundBlock = await getBlockById(blockId);

        if(!foundBlock) return handleNotFound(res,"Not found");

        const result = await getWeightOfBlock(blockId);

        return handleOk(res,result);
    }
}