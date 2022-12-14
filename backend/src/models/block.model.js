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


let Block = mongoose.model('block',blockSchema,'blocks');

module.exports = {
    getBlockById: async (id) => {
        const result = await Block.findById(id);
        return result;
    },
    createBlock: async (course,blockName,type)  => {
        const newBlock = new Block({
            course: course._id,
            name: blockName,
            type: type
        });
        const result = await newBlock.save();
        return result._id.toString();
    },
    deleteBlock: async (block) => {
        const result = await Block.deleteOne({_id:block._id});
        return result;
    },
    getAllBlockInCourse: async (courseId) => {
        const result = await Block.find({
            course:courseId
        });
        return result;
    },
}