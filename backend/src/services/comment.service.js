const { validateGuid, handleNotAllowed, handleNotFound, handleOk } = require("../lib/responseMessage");
const { getBlockById } = require("../models/block.model");
const { commentOnABlock, getAllCommentsByBlock, getCommentById, deleteAComment } = require("../models/comment.model");
const { populateUserWithUsername } = require("../models/users.model");



module.exports = {
    httpComment: async (req,res) => {
        const username = req.user.username;

        const blockId = req.params.blockId;

        if(!validateGuid(blockId)) return handleNotFound(res,"Invalid GUID");

        const content = req.body.content;

        const foundBlock = await getBlockById(blockId);

        const user = await populateUserWithUsername(username);
        const userId = user[0]._id;

        if(!foundBlock) return handleNotFound(res,"Not found");

        const result = await commentOnABlock(userId,blockId,content);

        return handleOk(res,result);
    },
    httpGetAllCommentByBlock: async (req,res) => {
        const blockId = req.params.blockId;
        if(!validateGuid(blockId)) return handleNotFound(res,"Invalid GUID");
        const foundBlock = await getBlockById(blockId);
        if(!foundBlock) return handleNotFound(res,"Not found");

        const comments = await getAllCommentsByBlock(blockId);
        return handleOk(res,comments);
    },
    httpGetCommentById: async (req,res) => {
        const commentId = req.params.commentId;

        if(!validateGuid(commentId)) return handleNotFound(res,"Invalid GUID");

        const comment = await getCommentById(commentId);

        if(!comment) return handleNotFound(res,"Not found");

        return handleOk(res,comment);
    },
    httpDeleteComment: async (req,res) => {
        const username = req.user.username;
        const commentId = req.params.commentId;

        if(!validateGuid(commentId)) return handleNotFound(res,"Invalid GUID");

        const comment = await getCommentById(commentId);

        const user = await populateUserWithUsername(username);

        if(!comment) return handleNotFound(res,"Not found");

        const singleUser = user[0];
        console.log(singleUser);
        console.log(comment.commenter);
        if(comment.commenter.username !== singleUser.username) return handleNotAllowed(res);

        const result = await deleteAComment(commentId);
        
        return handleOk(res,result);
    }
}