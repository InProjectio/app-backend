const LabelModel = require('./model');
const { cvtToNumber } = require('../../helpers/transform_data');

// Retrieve data

module.exports.getLabelList = async (req, res, next) => {
  try {
    const result = await LabelModel.list(req.query.workspace_id, req.user.user_id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getLabelById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await LabelModel.detail(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getLabelByTxHash = async (req, res, next) => {
  try {
    const txHash = req.params.txHash;
    const result = await LabelModel.getDetailByTxHash(txHash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTxHashById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await LabelModel.getTxHashById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTaskIdById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await LabelModel.getTaskIdById(id);
    next(cvtToNumber(result));
  } catch (error) {
    next(error);
  }
};

module.exports.checkVisibleOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await LabelModel.checkIsVisibleOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkDeletedOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await LabelModel.checkIsDeletedOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewLabel = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const result = await LabelModel.add(queryBody, req.user.user_id);
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
    const result = await LabelModel.updateById(id, queryBody, req.user.user_id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.switchVisibleStt = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await LabelModel.switchVisibleStt(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await LabelModel.deleteById(id, req.body.txHash);
    next(result);
  } catch (error) {
    next(error);
  }
};
