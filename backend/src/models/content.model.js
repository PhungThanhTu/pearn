const mongoose = require('mongoose');

const markdownContentSchema = mongoose.Schema({
    content: {
        required: true,
        type: String,
    },
})


let Block = mongoose.model('markdownContent',courseSchema,'contents');

module.exports = {
    upsertMarkdownContentInBlock: async (block,markdown) => {

    },
    deleteMarkdownContentInBlock: async (block) => {

    },
    getContent: async (block) => {

    }
}