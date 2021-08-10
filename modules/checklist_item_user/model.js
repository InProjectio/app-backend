const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const CLItemUser = new DB(process.env.DB_NAME, schemaInfo);

// Retrieve data

module.exports.list = async () => {
  const query = {
    deleted: 'n',
  };
  const clItemUserList = await CLItemUser.getList(query);
  return clItemUserList;
};

module.exports.detail = async (id) => {
  const clItemUserDetail = await CLItemUser.getOneById({
    field: 'item_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return clItemUserDetail;
};

module.exports.getDetailByTxHash = async (txHash) => {
  const clItemUserDetail = await CLItemUser.getOneById({
    field: 'txhash',
    value: txHash,
    otherOptions: { deleted: 'n' },
  });
  return clItemUserDetail;
};

module.exports.getTxHashById = async (id) => {
  const clItemUserDetail = await CLItemUser.getOneById({
    field: 'item_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return clItemUserDetail.txhash + '';
};

module.exports.getCLIdById = async (id) => {
  const clItemUserDetail = await CLItemUser.getOneById({
    field: 'item_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return clItemUserDetail.checklist_id + '';
};

module.exports.checkAssignerOrNot = async (id) => {
  const clItemUserDetail = await CLItemUser.getOneById({
    field: 'item_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return clItemUserDetail.assigner === 'y' ? 'true' : 'false';
};

module.exports.checkAssigneeOrNot = async (id) => {
  const clItemUserDetail = await CLItemUser.getOneById({
    field: 'item_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return clItemUserDetail.assignee === 'y' ? 'true' : 'false';
};

module.exports.checkIsDeletedOrNot = async (id) => {
  const clItemUserDetail = await CLItemUser.getOneById({
    field: 'item_id',
    value: id,
  });
  return clItemUserDetail.deleted === 'y' ? 'true' : 'false';
};

// Create new data

module.exports.add = async (data) => {
  CLItemUser.validateData(data);
  const newChecklist = await CLItemUser.createNew(data);
  return newChecklist;
};

// Update existed data

module.exports.updateById = async (id, data) => {
  const updatedChecklist = await CLItemUser.updateOneById(
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
  const updatedChecklist = await CLItemUser.switchStatus(
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
  const deletedChecklist = await CLItemUser.deleteById(id, {
    lean: true,
    new: true,
  });
  return deletedChecklist;
};
