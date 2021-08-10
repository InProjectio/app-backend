const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const ChecklistModel = new DB(process.env.DB_NAME, schemaInfo);

// Retrieve data

module.exports.list = async () => {
  const query = {
    deleted: 'n',
  };
  const checklistList = await ChecklistModel.getList(query);
  return checklistList;
};

module.exports.detail = async (id) => {
  const checklistDetail = await ChecklistModel.getOneById({
    field: 'checklist_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return checklistDetail;
};

module.exports.getDetailByTxHash = async (txHash) => {
  const checklistDetail = await ChecklistModel.getOneById({
    field: 'txhash',
    value: txHash,
    otherOptions: { deleted: 'n' },
  });
  return checklistDetail;
};

module.exports.getTxHashById = async (id) => {
  const checklistDetail = await ChecklistModel.getOneById({
    field: 'checklist_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return checklistDetail.txhash + '';
};

module.exports.getTaskIdById = async (id) => {
  const checklistDetail = await ChecklistModel.getOneById({
    field: 'checklist_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return checklistDetail.task_id + '';
};

module.exports.checkIsVisibleOrNot = async (id) => {
  const checklistDetail = await ChecklistModel.getOneById({
    field: 'checklist_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return checklistDetail.visible === 'y' ? 'true' : 'false';
};

module.exports.checkIsDeletedOrNot = async (id) => {
  const checklistDetail = await ChecklistModel.getOneById({
    field: 'checklist_id',
    value: id,
  });
  return checklistDetail.deleted === 'y' ? 'true' : 'false';
};

// Create new data

module.exports.add = async (data) => {
  ChecklistModel.validateData(data);
  const newChecklist = await ChecklistModel.createNew(data);
  return newChecklist;
};

// Update existed data

module.exports.updateById = async (id, data) => {
  const updatedChecklist = await ChecklistModel.updateOneById(
    { field: 'checklist_id', value: id, otherOptions: { deleted: 'n' } },
    data,
    {
      lean: true,
      new: true,
    }
  );
  return updatedChecklist;
};

module.exports.switchVisibleStt = async (id) => {
  const updatedChecklist = await ChecklistModel.switchStatus(
    { field: 'checklist_id', value: id, otherOptions: { deleted: 'n' } },
    'visible',
    {
      lean: true,
      new: true,
    }
  );
  return updatedChecklist;
};

module.exports.deleteById = async (id) => {
  const deletedChecklist = await ChecklistModel.updateOneById(
    { field: 'checklist_id', value: id, otherOptions: { deleted: 'n' } },
    { deleted: 'y' },
    {
      lean: true,
      new: true,
    }
  );
  return deletedChecklist;
};
