const PjUserModel = require('./model');
const { cvtToNumber } = require('../../helpers/transform_data');

// Retrieve data

module.exports.getPjUserList = async (req, res, next) => {
  try {
    const result = await PjUserModel.list();
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getPjUserDetail = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const result = await PjUserModel.detail(projectId, userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getPjUserDetailByTxhash = async (req, res, next) => {
  try {
    const txHash = req.params.txHash;
    const result = await PjUserModel.detailByTxhash(txHash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getPjUsersByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const result = await PjUserModel.getPjUsersUserId(userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getRole = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const result = await PjUserModel.getRole(projectId, userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getUsersByProjectId = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const result = await PjUserModel.getUsersByProjectId(projectId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getProjectsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const workspaceId = req.query.workspace_id || null;
    const result = await PjUserModel.getProjectsByUserId(userId, workspaceId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTaskIdById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await PjUserModel.getTaskIdById(id);
    next(cvtToNumber(result));
  } catch (error) {
    next(error);
  }
};

module.exports.checkIsOwner = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const result = await PjUserModel.checkIsOwnerOrNot(projectId, userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkDeletedOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await PjUserModel.checkIsDeletedOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewPjUser = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const result = await PjUserModel.add(queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Update data
module.exports.updateById = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const queryBody = req.body;
    const requestUserId = req.user.user_id;
    delete queryBody['is_owner'];
    const result = await PjUserModel.updateById(
      requestUserId,
      projectId,
      userId,
      queryBody
    );
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.switchVisibleStt = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await PjUserModel.switchVisibleStt(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.params.userId;
    const txhash = req.query.txhash || null;
    const requestUserId = req.user.user_id;

    const result = await PjUserModel.deleteById(
      requestUserId,
      projectId,
      userId,
      txhash
    );
    next(result);
  } catch (error) {
    next(error);
  }
};
