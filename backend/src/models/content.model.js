const mongoose = require('mongoose');

const markdownContentSchema = mongoose.Schema({
    content: {
        required: true,
        type: String,
    },
})


let MarkdownContent = mongoose.model('markdownContent',courseSchema,'contents');

module.exports = {
    createMarkdownContent: async (markdown) => {
        const newContent = new MarkdownContent({
            content: markdown
        });
        const result = await newContent.save();
        return result._id;
    },
    updateMarkdownContent: async (id,markdown) => {
        const result = await MarkdownContent.findByIdAndUpdate(id,{
            content:markdown
        },{
            new:true
        });
        return result;
    },
    deleteMarkdownContent: async (id) => {
        //TODO: delete both content in block and block itself
    },
    getContent: async (block) => {
        //TODO: retrieve content info when call
    }
}