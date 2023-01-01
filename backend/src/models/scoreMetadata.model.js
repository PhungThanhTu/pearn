const mongoose = require('mongoose');

const scoreMetadata = mongoose.Schema({

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
    scoreWeight:{
        required: true,
        type: Number,
        default: 0
    }
})

let ScoreMetadata = mongoose.model('scoreMeta',submissionSchema,'scoreMeta');

module.exports = {
    createScoreMeta: async (blockId, courseId, initialWeight) => {

    },
    setWeightForBlock: async (blockId, weight) => {

    },
    getWeightObject: async (courseId) => {

    }
}