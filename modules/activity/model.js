const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const ActivityModel = new DB(process.env.DB_NAME, schemaInfo);

// Retrieve data

module.exports.list = async () => {
  const query = {
    deleted: 'n',
  };
  const activityList = await ActivityModel.getList(query);
  return activityList;
};

module.exports.detail = async (id) => {
  const activityDetail = await ActivityModel.getOneById({
    field: 'activity_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return activityDetail;
};

module.exports.getDetailByTxHash = async (txHash) => {
  const activityDetail = await ActivityModel.getOneById({
    field: 'txhash',
    value: txHash,
    otherOptions: { deleted: 'n' },
  });
  return activityDetail;
};

module.exports.getTxHashById = async (id) => {
  const activityDetail = await ActivityModel.getOneById({
    field: 'activity_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return activityDetail.txhash + '';
};

module.exports.getTaskIdById = async (id) => {
  const activityDetail = await ActivityModel.getOneById({
    field: 'activity_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return activityDetail.task_id + '';
};

module.exports.checkIsVisibleOrNot = async (id) => {
  const activityDetail = await ActivityModel.getOneById({
    field: 'activity_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return activityDetail.visible === 'y' ? 'true' : 'false';
};

module.exports.checkIsDeletedOrNot = async (id) => {
  const activityDetail = await ActivityModel.getOneById({
    field: 'activity_id',
    value: id,
  });
  return activityDetail.deleted === 'y' ? 'true' : 'false';
};

// Create new data

module.exports.add = async (data) => {
  ActivityModel.validateData(data);
  const newActivity = await ActivityModel.createNew(data);
  return newActivity;
};

// Update existed data

module.exports.updateById = async (id, data) => {
  const updatedActivity = await ActivityModel.updateOneById(
    { field: 'activity_id', value: id, otherOptions: { deleted: 'n' } },
    data,
    {
      lean: true,
      new: true,
    }
  );
  return updatedActivity;
};

module.exports.switchVisibleStt = async (id) => {
  const updatedActivity = await ActivityModel.switchStatus(
    { field: 'activity_id', value: id, otherOptions: { deleted: 'n' } },
    'visible',
    {
      lean: true,
      new: true,
    }
  );
  return updatedActivity;
};

module.exports.deleteById = async (id) => {
  const deletedActivity = await ActivityModel.updateOneById(
    { field: 'activity_id', value: id, otherOptions: { deleted: 'n' } },
    { deleted: 'y' },
    {
      lean: true,
      new: true,
    }
  );
  return deletedActivity;
};
