const TaskUserModel = require('./model');

// Retrieve data

module.exports.getTaskUserList = async (req, res, next) => {
  try {
    const result = await TaskUserModel.list();
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTaskUserById = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const result = await TaskUserModel.detail(taskId, userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTaskUserByTxHash = async (req, res, next) => {
  try {
    const txHash = req.params.txHash;
    const result = await TaskUserModel.getDetailByTxHash(txHash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkIsAssigneeOrNot = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const result = await TaskUserModel.checkIsAssigneeOrNot(taskId, userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkIsOwnerOrNot = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const result = await TaskUserModel.checkIsOwnerOrNot(taskId, userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkIsWatchOrNot = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const result = await TaskUserModel.checkIsWatchOrNot(taskId, userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewTaskUser = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const result = await TaskUserModel.add(queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Update data
module.exports.transferTask = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const oldUserId = req.params.oldUserId;
    const newUserId = req.params.newUserId;
    await TaskUserModel.updateById(taskId, oldUserId, { is_owner: 'n' });
    const result = await TaskUserModel.updateById(taskId, newUserId, {
      is_owner: 'y',
    });
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.updateById = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const queryBody = req.body;
    const result = await TaskUserModel.updateById(taskId, userId, queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.switchVisibleStt = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await TaskUserModel.switchVisibleStt(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const result = await TaskUserModel.deleteById(taskId, userId);
    next(result);
  } catch (error) {
    next(error);
  }
};
