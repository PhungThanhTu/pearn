const mongoose = require('mongoose');

const markdownContentSchema = mongoose.Schema({
    content: {
        required: true,
        type: String,
    },
})


let Block = mongoose.model('markdownContent',markdownContentSchema ,'contents');

module.exports = {
    upsertMarkdownContentInBlock: async (block,markdown) => {
        // TODO: upsert block data
    },
    deleteMarkdownContentInBlock: async (block) => {
        //TODO: delete both content in block and block itself
    },
    getContent: async (block) => {
        //TODO: retrieve content info when call
    }
}