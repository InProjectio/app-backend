const CLItemUserModel = require('./model');
const { cvtToNumber } = require('../../helpers/transform_data');

// Retrieve data

module.exports.getCLItemUserList = async (req, res, next) => {
  try {
    const result = await CLItemUserModel.list();
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getCLItemUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await CLItemUserModel.detail(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getCLItemUserByTxHash = async (req, res, next) => {
  try {
    const txHash = req.params.txHash;
    const result = await CLItemUserModel.getDetailByTxHash(txHash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTxHashById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await CLItemUserModel.getTxHashById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getCLIdById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await CLItemUserModel.getCLIdById(id);
    next(cvtToNumber(result));
  } catch (error) {
    next(error);
  }
};

module.exports.checkIsAssignerOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await CLItemUserModel.checkAssignerOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkIsAssigneeOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await CLItemUserModel.checkAssigneeOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewCLItemUser = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const result = await CLItemUserModel.add(queryBody);
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
    const result = await CLItemUserModel.updateById(id, queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.switchVisibleStt = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await CLItemUserModel.switchVisibleStt(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await CLItemUserModel.deleteById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};
