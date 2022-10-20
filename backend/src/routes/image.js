var fs = require('fs')
var express = require('express');
var router = express.Router();
const imageMiddleware = require('../middlewares/image.middleware');
const model = require('../models/image.model');

router.post('/',imageMiddleware.single("image"),async (req,res) => {
   const img = fs.readFileSync(req.file.path);
   const encode_image = img.toString('base64');

   const final_data = {
    contentType: req.file.mimetype,
    file: Buffer.from(encode_image,'base64')
   };

   const result = await model.saveImage(final_data);
   // data will be stored in Mongo so we won't need the original image more
   fs.unlink(req.file.path);
   
   res.send(result._id);
})

router.get('/:id', async (req,res) => {
try {
    const result = await model.getImage(req.params.id);
    res.contentType(result.contentType);
    return res.send(result.file);
}
catch {
    return res.status(404).send("Could not find image");
}
   
   
});

module.exports = router;