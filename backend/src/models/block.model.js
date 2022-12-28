const mongoose = require('mongoose');

const blockSchema = mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    blockType: {
        required: true,
        type: String,
        enum: [
            "common",
            "exercise"
        ]
    },
    contentType: {
        required: true,
        type: String,
        enum: [
            'markdownContent'
        ]
    },
    course:{   
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'course'
    },
    content:{
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'contentType'
    },
})


let Block = mongoose.model('block',blockSchema,'blocks');

module.exports = {
    getBlockById: async (id) => {
        const result = await Block.find({
            _id: id
        }).populate('content');
        return result;
    },
    createBlock: async (courseId,blockName,blockType,contentType,contentId)  => {
        const newBlock = new Block({
            name: blockName,
            course: mongoose.Types.ObjectId(courseId),
            blockType: blockType,
            contentType: contentType,
            content: mongoose.Types.ObjectId(contentId)
        });
        const result = await newBlock.save();
        return result._id;
    },
    deleteBlock: async (blockId) => {
        const result = await Block.deleteOne({_id:blockId});
        return result;
    },
    getAllBlockInCourse: async (courseId) => {
        const blocks = await Block.find({course:mongoose.Types.ObjectId(courseId)})
        .populate('content');
        return blocks;
    },
}