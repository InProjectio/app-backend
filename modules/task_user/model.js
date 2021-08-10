const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const TaskUserModel = new DB(process.env.DB_NAME, schemaInfo);

// Retrieve data

module.exports.list = async () => {
  const query = {};
  const taskUserList = await TaskUserModel.getList(query);
  return taskUserList;
};

module.exports.detail = async (taskId, userId) => {
  const taskUserDetail = await TaskUserModel.getOneById({
    field: 'task_id',
    value: taskId,
    otherOptions: { user_id: userId },
  });
  return taskUserDetail;
};

module.exports.getDetailByTxHash = async (txHash) => {
  const taskUserDetail = await TaskUserModel.getOneById({
    field: 'txhash',
    value: txHash,
  });
  return taskUserDetail;
};

module.exports.getTxHashById = async (id) => {
  const taskUserDetail = await TaskUserModel.getOneById({
    field: 'taskUser_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return taskUserDetail.txhash + '';
};

module.exports.getTaskIdById = async (id) => {
  const taskUserDetail = await TaskUserModel.getOneById({
    field: 'taskUser_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return taskUserDetail.task_id + '';
};

module.exports.checkIsOwnerOrNot = async (taskId, userId) => {
  const taskUserDetail = await TaskUserModel.getOneById({
    field: 'task_id',
    value: taskId,
    otherOptions: { user_id: userId },
  });
  return taskUserDetail.is_owner === 'y' ? 'true' : 'false';
};

module.exports.checkIsAssigneeOrNot = async (taskId, userId) => {
  const taskUserDetail = await TaskUserModel.getOneById({
    field: 'task_id',
    value: taskId,
    otherOptions: { user_id: userId },
  });
  return taskUserDetail.is_assignee === 'y' ? 'true' : 'false';
};

module.exports.checkIsWatchOrNot = async (taskId, userId) => {
  const taskUserDetail = await TaskUserModel.getOneById({
    field: 'task_id',
    value: taskId,
    otherOptions: { user_id: userId },
  });
  return taskUserDetail.watch === 'y' ? 'true' : 'false';
};

// Create new data

module.exports.add = async (data) => {
  TaskUserModel.validateData(data);
  const newTaskUser = await TaskUserModel.createNew(data);
  return newTaskUser;
};

// Update existed data

module.exports.updateById = async (taskId, userId, data) => {
  const query = {
    field: 'task_id',
    value: taskId,
    otherOptions: { user_id: userId },
  };
  const updatedTaskUser = await TaskUserModel.updateOneById(query, data, {
    lean: true,
    new: true,
  });
  return updatedTaskUser;
};

module.exports.deleteById = async (taskId, userId) => {
  const query = {
    field: 'task_id',
    value: taskId,
    otherOptions: { user_id: userId },
  };
  const deletedTaskUser = await TaskUserModel.deleteOneById(query);
  return deletedTaskUser;
};
