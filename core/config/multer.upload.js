import multer from 'multer'
import generateRandomID from '../utils/generators'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    let uploadedFileExtension = file.originalname.split('.')[1]
    cb(null, generateRandomID() + '.' + uploadedFileExtension)
  }
});

const upload = multer({ storage: storage });
const multerUploadType = upload.single('file');

export default multerUploadType;
