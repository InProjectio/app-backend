const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const CLItemModel = new DB(process.env.DB_NAME, schemaInfo);

// Retrieve data

module.exports.list = async () => {
  const query = {
    deleted: 'n',
  };
  const clItemList = await CLItemModel.getList(query);
  return clItemList;
};

module.exports.detail = async (id) => {
  const clItemDetail = await CLItemModel.getOneById({
    field: 'item_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return clItemDetail;
};

module.exports.getDetailByTxHash = async (txHash) => {
  const clItemDetail = await CLItemModel.getOneById({
    field: 'txhash',
    value: txHash,
    otherOptions: { deleted: 'n' },
  });
  return clItemDetail;
};

module.exports.getTxHashById = async (id) => {
  const clItemDetail = await CLItemModel.getOneById({
    field: 'item_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return clItemDetail.txhash + '';
};

module.exports.getCLIdById = async (id) => {
  const clItemDetail = await CLItemModel.getOneById({
    field: 'item_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return clItemDetail.checklist_id + '';
};

module.exports.checkIsVisibleOrNot = async (id) => {
  const clItemDetail = await CLItemModel.getOneById({
    field: 'item_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return clItemDetail.visible === 'y' ? 'true' : 'false';
};

module.exports.checkIsDeletedOrNot = async (id) => {
  const clItemDetail = await CLItemModel.getOneById({
    field: 'item_id',
    value: id,
  });
  return clItemDetail.deleted === 'y' ? 'true' : 'false';
};

// Create new data

module.exports.add = async (data) => {
  CLItemModel.validateData(data);
  const newChecklist = await CLItemModel.createNew(data);
  return newChecklist;
};

// Update existed data

module.exports.updateById = async (id, data) => {
  const updatedChecklist = await CLItemModel.updateOneById(
    { field: 'item_id', value: id, otherOptions: { deleted: 'n' } },
    data,
    {
      lean: true,
      new: true,
    }
  );
  return updatedChecklist;
};

module.exports.switchVisibleStt = async (id) => {
  const updatedChecklist = await CLItemModel.switchStatus(
    { field: 'item_id', value: id, otherOptions: { deleted: 'n' } },
    'visible',
    {
      lean: true,
      new: true,
    }
  );
  return updatedChecklist;
};

module.exports.deleteById = async (id) => {
  const deletedChecklist = await CLItemModel.updateOneById(
    { field: 'item_id', value: id, otherOptions: { deleted: 'n' } },
    { deleted: 'y' },
    {
      lean: true,
      new: true,
    }
  );
  return deletedChecklist;
};
