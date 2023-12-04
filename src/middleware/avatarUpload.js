import path from 'path'
import multer from 'multer';
import { randomUUID } from 'crypto';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
    },
    filename: function (req, file, cb) {
        cb(null, randomUUID() + path.extname(file.originalname));
    }
});

export default multer({ storage: storage })
