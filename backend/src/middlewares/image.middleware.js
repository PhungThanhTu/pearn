var multer  = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,'');
    },
    filename: (req, file, cb) => {
      cb(null,'image'+Date.now());
    }
});

const upload = multer({storage: storage});

module.exports = upload;