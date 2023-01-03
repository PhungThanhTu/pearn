const mongoose = require('mongoose');
const { getSumWeight } = require('./scoreMetadata.model');

const submissionSchema = mongoose.Schema({

    block: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'block'
    },
    course: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    },
    studentUsername: {
        required: true,
        type: String
    },
    submissionType: {
        required: true,
        type: String,
        enum: [
            "markdown"
        ]
    },
    submission: {
        required: true,
        type: String
    },
    scoreOfTen: {
        required: true,
        type: Number,
        default: 0,
        min: 0,
        max: 10
    },
    scoreOverall: {
        required: false,
        type: Number,
        default: 0
    }
})

let Submission = mongoose.model('submission',submissionSchema,'sumissions')

module.exports = {
    submit: async (blockId,courseId,student,type,content) => {

        const query = {
            block: blockId,
            studentUsername: student
        };

        const updateData = {
            block: blockId,
            studentUsername: student,
            course: courseId,
            submissionType: type,
            submission: content
        }

       

        const foundSubmission = await Submission.findOne(query);

        if(foundSubmission) {
            const result = await Submission.findOneAndUpdate(query,updateData);
            return result;
        }
        else
        {
            const newSubmission = new Submission(updateData);
            const result = await newSubmission.save();
            return result;
        }
    },
    getSubmission: async (id) => {
        return await Submission.findById(id);
    },
    gradeSubmission: async (id, score,weight) => {

        const query = {
            _id:id
        };
        const updateData = {
            scoreOfTen: score,
            scoreOverall: score*weight
        }

        const result = await Submission.findOneAndUpdate(query,updateData,{
            new:true
        });
        return result;
    },
    getSumScore: async (student,course) => {

        const matchingAggregation = {
            $match: {
                "course":new mongoose.Types.ObjectId(course),
                "studentUsername":student
            }
        };

        const groupingAggregation = {
            $group: {
                _id: null,
                sumScore: {$sum: "$scoreOverall"}
            }
        }

        const aggregation = [matchingAggregation,groupingAggregation]

        const result = await Submission.aggregate(aggregation);
        return result[0].sumScore;
    },
    getAllSubmissionByBlock: async (blockId) => {
        const query = {
            block:blockId
        };

        const result = await Submission.find(query);
        return result;
    },
    getAllScoreByCourse: async (courseId) => {

        const sumWeight = await getSumWeight(courseId);
        const matchingAggregation = {
            $match:{
                "course": mongoose.Types.ObjectId(courseId)
            }
        };

        const groupingAggregation = {
            $group:{
                _id:"$studentUsername",
                sumScoreOverall:{$sum:"$scoreOverall"},
            }
        };

        const addFieldAggregation = {
            $addFields:{
                weight: sumWeight
            }
        }

        const divideAggregation = {
           $addFields:{
                score: {
                    "$divide":["$sumScoreOverall","$weight"]
                }
           }
        }

        const removeFieldsAggregation = {
            $project: {
                "sumScoreOverall":0,
                "weight":0
            }
        }


        return await Submission.aggregate([matchingAggregation,groupingAggregation,addFieldAggregation,divideAggregation,removeFieldsAggregation]);
    }
}