const mongoose = require('mongoose');


const commentSchema = new mongoose.Schema({
    block: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'block'
    },
    commenter: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    content: {
        required: true,
        type: String
    }
})

const Comment = mongoose.model('comment',commentSchema,'comment');

const population =  {
    _id:0,
    username:1,
    fullname:1,
    email: 1,
    role:1,
    avatar:1
};

module.exports = {
    commentOnABlock: async (user,blockId,content) => {


        const data = {
            commenter: user,
            block: blockId,
            content: content
        };

        const newComment = new Comment(data);
        const result = await newComment.save();
        return result;
    },
    getCommentById: async (commentId) => {
        const result = await Comment.findById(commentId).populate('commenter',population);
        return result;
    },
    deleteAComment: async (commentId) => {
        const result = await Comment.deleteOne({
            _id: commentId
        });
        return result;
    },
    getAllCommentsByBlock: async (blockId) => {
        const query = {
            block: blockId
        };
        const result = await Comment.find(query).populate('commenter',population);
        return result;
    }
}