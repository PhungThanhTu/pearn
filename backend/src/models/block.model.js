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
            name: blockName,
            course: course._id,
            type: type
        });
        const result = await newBlock.save();
        return result._id.toString();
    },
    deleteBlock: async (blockId) => {
        const result = await Block.deleteOne({_id:blockId});
        return result;
    },
    getAllBlockInCourse: async (course) => {
        const blocks = await Block.find({course:course._id});
        return blocks;
    },
}