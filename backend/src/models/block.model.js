const mongoose = require('mongoose');

const blockSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    type: {
        required:true,
        enum: [
            "common",
            "exercise"
        ]
    },
    course:{   
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    },
    content:{
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        refPath: contentTypes
    },
    contentTypes:{
        required:true,
        type: String,
        enum: [
            'markdownContent'
        ]
    }
})


let Block = mongoose.model('block',courseSchema,'blocks');

module.exports = {
    getBlockById: async (id) => {

    },
    createBlock: async (course,blockName,type)  => {

    },
    deleteBlock: async (block) => {

    },
    getAllBlockInCourse: async (course) => {

    },
}