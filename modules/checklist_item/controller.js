const CLItemModel = require('./model');
const { cvtToNumber } = require('../../helpers/transform_data');

// Retrieve data

module.exports.getCLItemList = async (req, res, next) => {
  try {
    const result = await CLItemModel.list();
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getCLItemById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await CLItemModel.detail(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getCLItemByTxHash = async (req, res, next) => {
  try {
    const txHash = req.params.txHash;
    const result = await CLItemModel.getDetailByTxHash(txHash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTxHashById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await CLItemModel.getTxHashById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getCLIdById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await CLItemModel.getCLIdById(id);
    next(cvtToNumber(result));
  } catch (error) {
    next(error);
  }
};

module.exports.checkVisibleOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await CLItemModel.checkIsVisibleOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkDeletedOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await CLItemModel.checkIsDeletedOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewCLItem = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const result = await CLItemModel.add(queryBody);
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
    const result = await CLItemModel.updateById(id, queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.switchVisibleStt = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await CLItemModel.switchVisibleStt(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await CLItemModel.deleteById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};
