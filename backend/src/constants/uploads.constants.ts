import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');

export const DESTINATION_PROFILE_IMAGE = './uploads/profileimages';
export const DEFAULT_PROFILE_IMAGE = 'default.png';
export const MAX_SIZE_IMAGE = 10 * 1000 * 1000;
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('El archivo no cumple los requisitos'), false);
  }
  callback(null, true);
};
export const Storage = {
  storage: diskStorage({
    destination: DESTINATION_PROFILE_IMAGE,
    filename: (req, file, cb) => {
      const filename: string = uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
  fileFilter: imageFileFilter,
  limits: { fileSize: MAX_SIZE_IMAGE },
};

export const DESTINATION_ATTACHMENTS = './uploads/attachments';
export const MAX_SIZE_ATTACHMENT = 10 * 1000 * 1000;
export const attachmentFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(pdf)$/)) {
    return callback(new Error('El archivo no cumple los requisitos'), false);
  }
  callback(null, true);
};
export const AttachmentStorage = {
  storage: diskStorage({
    destination: DESTINATION_ATTACHMENTS,
    filename: (req, file, cb) => {
      const filename: string = uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
  fileFilter: attachmentFileFilter,
  limits: { fileSize: MAX_SIZE_ATTACHMENT },
};
