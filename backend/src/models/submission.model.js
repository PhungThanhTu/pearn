const mongoose = require('mongoose');

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
    sumissionType: {
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
        default: 0
    }
})

let Submission = mongoose.model('submission',submissionSchema,'sumissions')

module.exports = {
    submit: async (blockId,courseId,student,type,content) => {

    },
    updateSubmit: async (blockId,student,content) => {

    },
    removeSumission: async (blockId,student) => {

    },
    getSubmission: async (id) => {

    },
    gradeSubmission: async (id, score) => {

    },
    getScoreObject: async (student,course) => {

    }
    
}