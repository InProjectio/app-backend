const TxhashModel = require('./model');
const { cvtToNumber } = require('../../helpers/transform_data');

// Retrieve data

module.exports.getTxhashList = async (req, res, next) => {
  try {
    const result = await TxhashModel.list();
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTxhashById = async (req, res, next) => {
  try {
    const txhash = req.params.txhash;
    const result = await TxhashModel.detail(txhash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTxhashsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const result = await TxhashModel.getTxhashsUserId(userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTxHashById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await TxhashModel.getTxHashById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTaskIdById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await TxhashModel.getTaskIdById(id);
    next(cvtToNumber(result));
  } catch (error) {
    next(error);
  }
};

module.exports.checkIsOutdate = async (req, res, next) => {
  try {
    const txhash = req.params.txhash;
    const result = await TxhashModel.checkIsOutdate(txhash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkDeletedOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await TxhashModel.checkIsDeletedOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewTxhash = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const result = await TxhashModel.add(queryBody);
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
    const result = await TxhashModel.updateById(id, queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.switchVisibleStt = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await TxhashModel.switchVisibleStt(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await TxhashModel.deleteById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};
