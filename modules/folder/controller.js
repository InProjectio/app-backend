const FolderModel = require('./model');
const { cvtToNumber } = require('../../helpers/transform_data');

// Retrieve data

module.exports.getFolderList = async (req, res, next) => {
  try {
    const result = await FolderModel.list();
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getFolderById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await FolderModel.detail(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getFolderByTxHash = async (req, res, next) => {
  try {
    const txHash = req.params.txHash;
    const result = await FolderModel.getDetailByTxHash(txHash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTxHashById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await FolderModel.getTxHashById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getPJIdById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await FolderModel.getPJIdById(id);
    next(cvtToNumber(result));
  } catch (error) {
    next(error);
  }
};

module.exports.checkVisibleOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await FolderModel.checkIsVisibleOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkDeletedOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await FolderModel.checkIsDeletedOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewFolder = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const result = await FolderModel.add(queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Update data
module.exports.updateById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const queryBody = req.body;
    const result = await FolderModel.updateById(id, queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.switchVisibleStt = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await FolderModel.switchVisibleStt(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await FolderModel.deleteById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};
