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
        // TODO: retrieve block object by id
    },
    createBlock: async (course,blockName,type)  => {
        // TODO: create new block
    },
    deleteBlock: async (block) => {
        // TODO: delete block
    },
    getAllBlockInCourse: async (course) => {
        // TODO: get all block in course
    },
}