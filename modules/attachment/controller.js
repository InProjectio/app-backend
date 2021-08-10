const fs = require('fs');
const AttachmentModel = require('./model');
const { cvtToNumber } = require('../../helpers/transform_data');

// Retrieve data

module.exports.getAttachment = async (req, res, next) => {
  const filename = req.query.filename || null;
  if (filename && fs.existsSync(process.env.STORAGE_DIR + `\\${filename}`)) {
    const readStream = fs.createReadStream(
      process.env.STORAGE_DIR + `\\${filename}`
    );
    return readStream.pipe(res);
  }
  return res.send(null);
};

module.exports.getAttList = async (req, res, next) => {
  try {
    const result = await AttachmentModel.list();
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getAttById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await AttachmentModel.detail(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getAttByTxHash = async (req, res, next) => {
  try {
    const txHash = req.params.txHash;
    const result = await AttachmentModel.getDetailByTxHash(txHash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTxHashById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await AttachmentModel.getTxHashById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTaskIdById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await AttachmentModel.getTaskIdById(id);
    next(cvtToNumber(result));
  } catch (error) {
    next(error);
  }
};

module.exports.getUserIdById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await AttachmentModel.getUserIdById(id);
    next(cvtToNumber(result));
  } catch (error) {
    next(error);
  }
};

module.exports.checkVisibleOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await AttachmentModel.checkIsVisibleOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkDeletedOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await AttachmentModel.checkIsDeletedOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewAtt = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const result = await AttachmentModel.add(queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.uploadAttachments = async (req, res, next) => {
  const uploadedFiles = req.files;
  const currentUserId = req.user.user_id;
  const uploadedAttachments = await AttachmentModel.uploadAttachments(
    uploadedFiles,
    currentUserId
  );
  next(uploadedAttachments);
};

// Update data
module.exports.updateById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const queryBody = req.body;
    const result = await AttachmentModel.updateById(id, queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.switchVisibleStt = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await AttachmentModel.switchVisibleStt(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await AttachmentModel.deleteById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};
