const multer = require('multer');
const path = require('path');

/*
const storage = multer.diskStorage({
    destination: function(req,res, cb) {
        cb();
    },                   
    filename: function(req, file, cb) {
        cb();
    },
});
*/

const upload = multer({ storage });

module.exports = upload;