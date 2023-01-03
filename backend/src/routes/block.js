var express = require('express');
var router = express.Router();
const { authorize } = require('../middlewares/auth.middleware');
const { getBlockById } = require('../models/block.model');
const { httpCreateMarkdownBlock, httpGetAllBlocks, httpGetBlock, httpUpdateMarkdownBlock, httpDeleteBlock, httpCreateMarkdownExerciseBlock } = require('../services/block.service');


// BLOCK API
router.post('/markdown',authorize("lecturer"),httpCreateMarkdownBlock);
router.post('/markdownExercise',authorize("lecturer"),httpCreateMarkdownExerciseBlock);
router.get('/:id',authorize(undefined),httpGetBlock);
router.get('/blocks/:id',authorize(undefined),httpGetAllBlocks);
router.patch('/markdown/:id',authorize(undefined),httpUpdateMarkdownBlock);
router.delete('/:id',authorize(undefined),httpDeleteBlock);


module.exports = router;
