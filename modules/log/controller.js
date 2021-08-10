const LogModel = require('./model');
const { cvtToNumber } = require('../../helpers/transform_data');

// Retrieve data

module.exports.getLogList = async (req, res, next) => {
  try {
    const result = await LogModel.list();
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getLogById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await LogModel.detail(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getLogsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const result = await LogModel.getLogsUserId(userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTxHashById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await LogModel.getTxHashById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTaskIdById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await LogModel.getTaskIdById(id);
    next(cvtToNumber(result));
  } catch (error) {
    next(error);
  }
};

module.exports.checkVisibleOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await LogModel.checkIsVisibleOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkDeletedOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await LogModel.checkIsDeletedOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewLog = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const result = await LogModel.add(queryBody);
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
    const result = await LogModel.updateById(id, queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.switchVisibleStt = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await LogModel.switchVisibleStt(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await LogModel.deleteById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};
