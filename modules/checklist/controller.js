const ChecklistModel = require('./model');
const { cvtToNumber } = require('../../helpers/transform_data');

// Retrieve data

module.exports.getCLList = async (req, res, next) => {
  try {
    const result = await ChecklistModel.list();
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getCLById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ChecklistModel.detail(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getCLByTxHash = async (req, res, next) => {
  try {
    const txHash = req.params.txHash;
    const result = await ChecklistModel.getDetailByTxHash(txHash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTxHashById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ChecklistModel.getTxHashById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTaskIdById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ChecklistModel.getTaskIdById(id);
    next(cvtToNumber(result));
  } catch (error) {
    next(error);
  }
};

module.exports.checkVisibleOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ChecklistModel.checkIsVisibleOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkDeletedOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ChecklistModel.checkIsDeletedOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewCL = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const result = await ChecklistModel.add(queryBody);
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
    const result = await ChecklistModel.updateById(id, queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.switchVisibleStt = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ChecklistModel.switchVisibleStt(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ChecklistModel.deleteById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};
