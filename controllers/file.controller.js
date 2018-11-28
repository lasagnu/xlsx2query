import File from '../models/file.model'
import logger from '../core/logger/app-logger'
import {readCell, readCells} from '../controllers/xlsx.controller.js'

const controller = {};

controller.getAll = async (req, res) => {
    try {
        const files = await File.getAll();
        logger.info('getting all files');
        res.send(files);
    }
    catch(err) {
        logger.error('Error in getting files - ' + err);
        res.send('Got error in getAll');
    }
}

controller.getByID = async (req, res) => {
    let fileID = req.params.file_id;
    try{
        const file = await File.getByID(fileID);
        logger.info('File: ' + fileID + ' exists.');
        res.send(file);
    }
    catch(err) {
        logger.error('File with id:' + fileID + ' does not exist.\n' + err);
        res.send(JSON.stringify({ result: 0 }));
    }
}

controller.getAllNames = async (req, res) => {
    try {
        const files = await File.getAllNames();
        logger.info('Returning file names');
        res.send(files);
    }
    catch(err) {
        logger.error('Error in getting file names - ' + err);
        res.send('Got error in getAllNames');
    }
}

controller.addFile = async (req, res) => {
    let fileToAdd = File({
        name: req.body.name,
        file_id: req.body.file_id,
        name_orig: req.body.name_orig,
        path: 'uploads/' + req.body.name + '.xlsx',
        status: req.body.status
    });
    try {
        const savedFile = await File.addFile(fileToAdd);
        logger.info('Adding file');
    }
    catch(err) {
        logger.error('Error in adding files - ' + err);
    }
}

controller.removeFile = async (req, res) => {
    let fileName = req.body.name;
    try{
        const removedFile = await File.removeFile(fileName);
        logger.info('Deleted file: ' + removedFile);
        res.send('File successfully deleted');
    }
    catch(err) {
        logger.error('Failed to delete file: ' + err);
        res.send('Delete failed.');
    }
}

controller.uploadFile = async (req, res) => {
  try{
    let uploadedFileExtension = req.file.originalname.split('.')[1];
    let uploadedFileGeneratedName = req.file.filename.split('.')[0];
    if((req.file.mimetype == 'application/octet-stream' || req.file.mimetype == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') && uploadedFileExtension == 'xlsx') {
      let filePath = 'uploads/' + req.file.filename;

      let fileObj = {
      body: {
        name: req.file.filename.split('.')[0],
        name_orig: req.file.originalname,
        path: filePath,
        status: 'ACTIVE'
        }
      };

      await controller.addFile(fileObj);
      res.redirect('/file/' + uploadedFileGeneratedName);
    }
    else {
      res.render('file-upload', { querybody: 'File is not valid. Try again.' });
    }
  }
  catch(err) {
      logger.error('Failed to delete file: ' + err);
      res.render('file-upload', { querybody: 'Error occured during upload. Try again.' });
  }
}

controller.processFile = async (req, res) => {
    let fileID = req.params.file_id;
    try{
        const file = await File.getByID(fileID);
        let stringify = JSON.stringify(file);
        let parsed = JSON.parse(stringify);
        let activity, fileOriginalName, fileName, filePath = '';

        for (let i = 0; i < parsed.length; i++){
          activity = parsed[i]['status'];
          fileOriginalName = parsed[i]['name_orig'];
          fileName = parsed[i]['name'];
          filePath = parsed[i]['path'];
        }

        if(activity == 'ACTIVE'){
            res.render('xlsx-search-bar');
        }
        else {
            res.render('404');
        }
    }
    catch(err) {
        logger.error('File with id:' + fileID + ' encountered error: ' + err);
        res.send(JSON.stringify({ result: 'File loading failed' }));
    }
}

controller.getValuesFromXLSX = async (req, res) => {
    let fileID = req.params.file_id;
    let valueRange = req.body.range;

    try {
        let file = await File.getByID(fileID);
        let stringify = JSON.stringify(file);
        let parsed = JSON.parse(stringify);
        let filePath = '';

        for (let i = 0; i < parsed.length; i++){
          filePath = parsed[i]['path'];
        }

        if(/[a-zA-Z]\d+\:[a-zA-Z]\d+/gm.test(valueRange)){
          let values = await readCells(filePath, valueRange);
          res.send(values);
        }
        else {
          res.send('Value range specified in wrong format, example use: \'A1:B3\'');
        }
    }
    catch(err) {
        logger.error('Error in getValuesFromXLSX() - ' + err);
        res.send('Could not fetch values from XLSX file.');
    }
}

export default controller;
