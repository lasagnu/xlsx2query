import express from 'express'
import fileController from '../controllers/file.controller'
import logger from '../core/logger/app-logger'
import multerUploadType from '../core/config/multer.upload.js'

const router = express.Router()

/* GET home page */
router.get('/', function(req, res, next) {
  res.render('file-upload', { title: 'Git maszynka v0.1', querybody:'Wrzuc pliczek, prosze!' });
});

/* GET list all files */
router.get('/all', (req, res) => {
    fileController.getAll(req, res);
});

/* GET all names of files */
router.get('/names', (req, res) => {
    fileController.getAllNames(req, res);
});

/* GET upload a file and check if it is valid */
router.post('/upload', multerUploadType, function(req, res) {
  fileController.uploadFile(req, res);
});

//  GET open file if exists
router.get('/:file_id(\\d+)', (req, res) => {
    fileController.processFile(req, res);
});

/* POST get values from the file */
router.post('/:file_id(\\d+)/', (req, res) => {
    fileController.getValuesFromXLSX(req, res);
});

router.post('/add', (req, res) => {
    fileController.addFile(req, res);
});

router.delete('/delete', (req, res) => {
    fileController.removeFile(req, res);
});

export default router;
