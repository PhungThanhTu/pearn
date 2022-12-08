const mongoose = require("mongoose");

const imageSchema = mongoose.Schema({
  contentType: String,
  file: Buffer,
});

const Image = mongoose.model("images", imageSchema);

module.exports = {
  saveImage: async (image) => {
    const newImage = new Image(image);
    const result = await newImage.save();
    return result;
  },
  getImage: async (oid) => {
    return await Image.findById(oid);
  },
};
