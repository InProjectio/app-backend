const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const FolderModel = new DB(process.env.DB_NAME, schemaInfo);

// Retrieve data

module.exports.list = async () => {
  const query = {
    deleted: 'n',
  };
  const folderList = await FolderModel.getList(query);
  return folderList;
};

module.exports.detail = async (id) => {
  const folderDetail = await FolderModel.getOneById({
    field: 'folder_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return folderDetail;
};

module.exports.getDetailByTxHash = async (txHash) => {
  const folderDetail = await FolderModel.getOneById({
    field: 'txhash',
    value: txHash,
    otherOptions: { deleted: 'n' },
  });
  return folderDetail;
};

module.exports.getTxHashById = async (id) => {
  const folderDetail = await FolderModel.getOneById({
    field: 'folder_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return folderDetail.txhash + '';
};

module.exports.getPJIdById = async (id) => {
  const folderDetail = await FolderModel.getOneById({
    field: 'folder_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return folderDetail.project_id + '';
};

module.exports.checkIsVisibleOrNot = async (id) => {
  const folderDetail = await FolderModel.getOneById({
    field: 'folder_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return folderDetail.visible === 'y' ? 'true' : 'false';
};

module.exports.checkIsDeletedOrNot = async (id) => {
  const folderDetail = await FolderModel.getOneById({
    field: 'folder_id',
    value: id,
  });
  return folderDetail.deleted === 'y' ? 'true' : 'false';
};

// Create new data

module.exports.add = async (data) => {
  FolderModel.validateData(data);
  const newChecklist = await FolderModel.createNew(data);
  return newChecklist;
};

// Update existed data

module.exports.updateById = async (id, data) => {
  const updatedChecklist = await FolderModel.updateOneById(
    { field: 'folder_id', value: id, otherOptions: { deleted: 'n' } },
    data,
    {
      lean: true,
      new: true,
    }
  );
  return updatedChecklist;
};

module.exports.switchVisibleStt = async (id) => {
  const updatedChecklist = await FolderModel.switchStatus(
    { field: 'folder_id', value: id, otherOptions: { deleted: 'n' } },
    'visible',
    {
      lean: true,
      new: true,
    }
  );
  return updatedChecklist;
};

module.exports.deleteById = async (id) => {
  const deletedChecklist = await FolderModel.updateOneById(
    { field: 'folder_id', value: id, otherOptions: { deleted: 'n' } },
    { deleted: 'y' },
    {
      lean: true,
      new: true,
    }
  );
  return deletedChecklist;
};
