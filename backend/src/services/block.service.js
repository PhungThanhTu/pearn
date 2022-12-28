const { createBlock, getBlockById, getAllBlockInCourse, deleteBlock } = require("../models/block.model")
const { deleteMarkdownContent, createMarkdownContent, updateMarkdownContent } = require("../models/content.model")
const {handleOk, handleNotFound} = require('../lib/responseMessage');

const BlockContentDeletionExecutions = {
    "markdownContent": async (id) => {
        return await deleteMarkdownContent(id)
    }
}

const findBlock = async (blockId,res) => {
    const foundBlock = await getBlockById(blockId);
    if(foundBlock)
        return foundBlock;
    return handleNotFound(res,"Block not found");
}


module.exports = {
    httpCreateMarkdownBlock: async (req,res) => {
        const name = req.body.name;
        const contentType = "markdownContent";
        const blockType = "common";
        const courseId = req.body.courseId;
        const markdown = req.body.markdown;

        const newMarkdowncontent = await createMarkdownContent(markdown);

        console.info("Markdown Content Created");
        console.log(newMarkdowncontent);

        const newBlock = await createBlock(courseId,name,blockType,contentType,newMarkdowncontent);

        console.info("New block created");
        console.log(newBlock);

        return handleOk(res,newBlock);
        
    },
    httpGetBlock: async (req,res) => {
        const block = await getBlockById(req.params.id);

        if(!block) return handleNotFound(res,"block not found");

        return handleOk(res,block);

    },
    httpUpdateMarkdownBlock: async (req,res) => {
        
        const blockId = req.params.id;
        const updatingMarkdown = req.body.markdown;

        console.info(`UPDATING MARKDOWN BLOCK WITH ID ${blockId}`);
        console.log(updatingMarkdown);

        const foundBlock = await findBlock(blockId,res);
        const markdownId = foundBlock[0].content._id;

        console.info("FOUND BLOCK DETAILS:");
        console.log(foundBlock);

        console.log(`UPDATING MARKDOWN CONTENT ID ${markdownId}`);

        const result = await updateMarkdownContent(markdownId,updatingMarkdown);

        return handleOk(res,result);

        //TO-DO Test this API

    },
    httpGetAllBlocks: async (req,res) => {

        const courseId = req.params.id;

        const result = await getAllBlockInCourse(courseId);

        console.log(`Get all block in course ${courseId}`);

        return handleOk(res,result);

    },
    httpDeleteBlock: async (req,res) => {
        const blockId = req.params.id;

        const block = await getBlockById(blockId);

        if(!block) return handleNotFound(res,"Block Not Found");

        console.log(block);

        const contentId = block[0].content._id;
        const contentType = block[0].contentType;

        const contentDeleteResult = await BlockContentDeletionExecutions[contentType](contentId);
        
        console.info("Content in block deleted");
        console.log(contentDeleteResult);

        const blockDeleteResult = await deleteBlock(blockId);

        console.info("Block deleted");
        console.log(blockDeleteResult);

        return handleOk(res,blockDeleteResult);
    }
}