import mongoose from 'mongoose';

const FileSchema = mongoose.Schema({
    name:   {type: String, required: true, unique: true, index: true},
    file_id:   {type: Number},
    name_orig:  {type: String, required: true},
    path:  {type: String, required: true},
    upload_date:   { type: Date, default: Date.now },
    activity_date: { type: Date, default: Date.now },
    status: {type: String}
}, {collection : 'Files'});

let FileModel = mongoose.model('File', FileSchema);

FileModel.getAll = () => {
    return FileModel.find({});
}

FileModel.getByID = (fileID) => {
  let fileProjection = {
    __v: false,
    _id: false,
    upload_date: false,
    activity_date: false
  }
    return FileModel.find({name: fileID}, fileProjection);
}

FileModel.getAllNames = () => {
    let fileProjection = {
      __v: false,
      _id: false,
      name: false,
      values: false,
      regex: false
    }
    return FileModel.find({}, fileProjection);
}

FileModel.addFile = (fileToAdd) => {
    return fileToAdd.save();
}

FileModel.removeFile = (fileName) => {
    return FileModel.remove({name: fileName});
}

export default FileModel;
