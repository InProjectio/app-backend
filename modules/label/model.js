const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const LabelModel = new DB(process.env.DB_NAME, schemaInfo);

// Retrieve data

module.exports.list = async (workspace_id, user_id) => {
  const query = {
    deleted: 'n',
    user_id,
    workspace_id
  };
  const labelList = await LabelModel.getList(query);
  return labelList;
};

module.exports.detail = async (id) => {
  const labelDetail = await LabelModel.getOneById({
    field: 'label_id',
    value: id,
  });
  return labelDetail;
};

module.exports.getDetailByTxHash = async (txHash) => {
  const labelDetail = await LabelModel.getOneById({
    field: 'txhash',
    value: txHash,
  });
  return labelDetail;
};

module.exports.getTxHashById = async (id) => {
  const labelDetail = await LabelModel.getOneById({
    field: 'label_id',
    value: id,
  });
  return labelDetail.txhash + '';
};

module.exports.getTaskIdById = async (id) => {
  const labelDetail = await LabelModel.getOneById({
    field: 'label_id',
    value: id,
  });
  return labelDetail.task_id + '';
};

module.exports.checkIsVisibleOrNot = async (id) => {
  const labelDetail = await LabelModel.getOneById({
    field: 'label_id',
    value: id,
  });
  return labelDetail.visible === 'y' ? 'true' : 'false';
};

module.exports.checkIsDeletedOrNot = async (id) => {
  const labelDetail = await LabelModel.getOneById({
    field: 'label_id',
    value: id,
  });
  return labelDetail.deleted === 'y' ? 'true' : 'false';
};

// Create new data

module.exports.add = async (data, user_id) => {
  LabelModel.validateData({...data, user_id});
  const newLabel = await LabelModel.createNew({...data, user_id});
  return newLabel;
};

// Update existed data

module.exports.updateById = async (id, data, user_id) => {
  const updatedLabel = await LabelModel.updateOneById(
    { field: 'label_id', value: id },
    {...data, user_id},
    {
      lean: true,
      new: true,
    }
  );
  return updatedLabel;
};

module.exports.switchVisibleStt = async (id) => {
  const updatedLabel = await LabelModel.switchStatus(
    { field: 'label_id', value: id },
    'visible',
    {
      lean: true,
      new: true,
    }
  );
  return updatedLabel;
};

module.exports.deleteById = async (id, txhash) => {
  const deletedLabel = await LabelModel.updateOneById({
    field: 'label_id',
    value: id,
  }, {
    deleted: 'y',
    txhash
  });
  return deletedLabel;
};
