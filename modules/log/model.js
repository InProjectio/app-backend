const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const LogModel = new DB(process.env.DB_NAME, schemaInfo);

// Retrieve data

module.exports.list = async () => {
  const query = {};
  const logList = await LogModel.getList(query);
  return logList;
};

module.exports.detail = async (id) => {
  const logDetail = await LogModel.getOneById({
    field: 'log_id',
    value: id,
  });
  return logDetail;
};

module.exports.getLogsUserId = async (userId) => {
  const query = {
    user_id: userId,
  };
  const logList = await LogModel.getList(query);
  return logList;
};

module.exports.getTxHashById = async (id) => {
  const logDetail = await LogModel.getOneById({
    field: 'log_id',
    value: id,
  });
  return logDetail.txhash + '';
};

module.exports.getTaskIdById = async (id) => {
  const logDetail = await LogModel.getOneById({
    field: 'log_id',
    value: id,
  });
  return logDetail.task_id + '';
};

module.exports.checkIsVisibleOrNot = async (id) => {
  const logDetail = await LogModel.getOneById({
    field: 'log_id',
    value: id,
  });
  return logDetail.visible === 'y' ? 'true' : 'false';
};

module.exports.checkIsDeletedOrNot = async (id) => {
  const logDetail = await LogModel.getOneById({
    field: 'log_id',
    value: id,
  });
  return logDetail.deleted === 'y' ? 'true' : 'false';
};

// Create new data

module.exports.add = async (data) => {
  LogModel.validateData(data);
  const newLog = await LogModel.createNew(data);
  return newLog;
};

// Update existed data

module.exports.updateById = async (id, data) => {
  const updatedLog = await LogModel.updateOneById(
    { field: 'log_id', value: id },
    data,
    {
      lean: true,
      new: true,
    }
  );
  return updatedLog;
};

module.exports.switchVisibleStt = async (id) => {
  const updatedLog = await LogModel.switchStatus(
    { field: 'log_id', value: id },
    'visible',
    {
      lean: true,
      new: true,
    }
  );
  return updatedLog;
};

module.exports.deleteById = async (id) => {
  const deletedLog = await LogModel.deleteOneById({
    field: 'log_id',
    value: id,
  });
  return deletedLog;
};
