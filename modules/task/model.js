const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const TaskModel = new DB(process.env.DB_NAME, schemaInfo);

// Retrieve data

module.exports.list = async () => {
  const query = {
    deleted: 'n',
  };
  const taskList = await TaskModel.getList(query);
  return taskList;
};

module.exports.detail = async (id) => {
  const taskDetail = await TaskModel.getOneById({
    field: 'task_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return taskDetail;
};

module.exports.getDetailByTxHash = async (txHash) => {
  const taskDetail = await TaskModel.getOneById({
    field: 'txhash',
    value: txHash,
    otherOptions: { deleted: 'n' },
  });
  return taskDetail;
};

module.exports.getTxHashById = async (id) => {
  const taskDetail = await TaskModel.getOneById({
    field: 'task_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return taskDetail.txhash + '';
};

module.exports.getFolderIdById = async (id) => {
  const taskDetail = await TaskModel.getOneById({
    field: 'task_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return taskDetail.folder_id + '';
};

module.exports.checkIsDeletedOrNot = async (id) => {
  const taskDetail = await TaskModel.getOneById({
    field: 'task_id',
    value: id,
  });
  return taskDetail.deleted === 'y' ? 'true' : 'false';
};

// Create new data

module.exports.add = async (data) => {
  TaskModel.validateData(data);
  const newTask = await TaskModel.createNew(data);
  return newTask;
};

// Update existed data

module.exports.updateById = async (id, data) => {
  const updatedTask = await TaskModel.updateOneById(
    { field: 'task_id', value: id, otherOptions: { deleted: 'n' } },
    data,
    {
      lean: true,
      new: true,
    }
  );
  return updatedTask;
};

module.exports.switchVisibleStt = async (id) => {
  const updatedTask = await TaskModel.switchStatus(
    { field: 'task_id', value: id, otherOptions: { deleted: 'n' } },
    'visible',
    {
      lean: true,
      new: true,
    }
  );
  return updatedTask;
};

module.exports.deleteById = async (id, txhash) => {
  const deletedTask = await TaskModel.updateOneById(
    { field: 'task_id', value: id, otherOptions: { deleted: 'n' } },
    { deleted: 'y', txhash },
    {
      lean: true,
      new: true,
    }
  );
  return deletedTask;
};
