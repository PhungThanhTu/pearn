const mongoose = require('mongoose');

const submissionSchema = mongoose.Schema({

    block: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'block'
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
    markdownSubmission: {
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
    
}