const multer = require('multer');
const uuid = require('uuid/v1');

const MIME_TYPE_MAP = {
    'image/png':'png',
    'image/jpg':'jpg',
    'image/jpeg':'jpeg'
};

const fileUpload = multer({
    limits: 500000,
    storage: multer.diskStorage({
        destination: (req,file,cb) => {
            //we decide where we save the images
            cb(null, 'uploads/images');
        },
        filename: (req,file,cb) => {
            //image/png is being converted to png 
            const ext = MIME_TYPE_MAP[file.mimetype];
            //in order to give name
            cb(null,uuid()+'.'+ext);
        }
    }),
    fileFilter: (req,file,cb) => {
        // !! -> that means if the result is undefined that converts to the false
        //or if the result is something that converts to the true
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type!');
        //2.argument says that should I accept the file or not?
        cb(error, isValid)
    }
});

module.exports=fileUpload;