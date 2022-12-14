const mongoose = require('mongoose');

const markdownContentSchema = mongoose.Schema({
    content: {
        required: true,
        type: String,
    },
})


let MarkdownContent = mongoose.model('markdownContent',courseSchema,'contents');

module.exports = {
    upsertMarkdownContentInBlock: async (block,markdown) => {
        if(!block.content) {
            const newContent = new MarkdownContent({
                content: markdown
            });
            

        }
    },
    deleteMarkdownContentInBlock: async (block) => {
        //TODO: delete both content in block and block itself
    },
    getContent: async (block) => {
        //TODO: retrieve content info when call
    }
}