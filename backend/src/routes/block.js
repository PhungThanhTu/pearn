var express = require('express');
var router = express.Router();
const { authorize } = require('../middlewares/auth.middleware');
const { getBlockById } = require('../models/block.model');
const { httpCreateMarkdownBlock, httpGetAllBlocks, httpGetBlock, httpUpdateMarkdownBlock, httpDeleteBlock, httpCreateMarkdownExerciseBlock } = require('../services/block.service');
const { httpComment, httpGetAllCommentByBlock, httpGetCommentById, httpDeleteComment } = require('../services/comment.service');



// BLOCK API
router.post('/markdown',authorize("lecturer"),httpCreateMarkdownBlock);
router.post('/markdownExercise',authorize("lecturer"),httpCreateMarkdownExerciseBlock);
router.get('/:id',authorize(undefined),httpGetBlock);
router.get('/blocks/:id',authorize(undefined),httpGetAllBlocks);
router.patch('/markdown/:id',authorize(undefined),httpUpdateMarkdownBlock);
router.delete('/:id',authorize(undefined),httpDeleteBlock);
router.post('/comment/:blockId',authorize(undefined),httpComment);
router.get('/comments/:blockId',authorize(undefined),httpGetAllCommentByBlock);
router.get('/comment/:commentId',authorize(undefined),httpGetCommentById);
router.delete('/comment/:commentId',authorize(undefined),httpDeleteComment);

module.exports = router;
