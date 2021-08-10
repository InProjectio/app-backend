const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const WorkspaceModel = new DB(process.env.DB_NAME, schemaInfo);

// Retrieve data

module.exports.list = async () => {
  const query = {
    deleted: 'n',
  };
  const workspaceList = await WorkspaceModel.getList(query);
  return workspaceList;
};

module.exports.detail = async (id) => {
  const workspaceDetail = await WorkspaceModel.getOneById({
    field: 'workspace_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return workspaceDetail;
};

module.exports.getDetailByTxHash = async (txHash) => {
  const workspaceDetail = await WorkspaceModel.getOneById({
    field: 'txhash',
    value: txHash,
    otherOptions: { deleted: 'n' },
  });
  return workspaceDetail;
};

module.exports.getTxHashById = async (id) => {
  const workspaceDetail = await WorkspaceModel.getOneById({
    field: 'workspace_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return workspaceDetail.txhash + '';
};

module.exports.checkIsVisibleOrNot = async (id) => {
  const workspaceDetail = await WorkspaceModel.getOneById({
    field: 'workspace_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return workspaceDetail.visible === 'y' ? 'true' : 'false';
};

module.exports.checkIsDeletedOrNot = async (id) => {
  const workspaceDetail = await WorkspaceModel.getOneById({
    field: 'workspace_id',
    value: id,
  });
  return workspaceDetail.deleted === 'y' ? 'true' : 'false';
};

// Create new data

module.exports.add = async (data) => {
  WorkspaceModel.validateData(data);
  const newWorkspace = await WorkspaceModel.createNew(data);
  return newWorkspace;
};

// Update existed data

module.exports.updateById = async (id, data) => {
  const updatedWorkspace = await WorkspaceModel.updateOneById(
    { field: 'workspace_id', value: id, otherOptions: { deleted: 'n' } },
    data,
    {
      lean: true,
      new: true,
    }
  );
  return updatedWorkspace;
};

module.exports.switchVisibleStt = async (id) => {
  const updatedWorkspace = await WorkspaceModel.switchStatus(
    { field: 'workspace_id', value: id, otherOptions: { deleted: 'n' } },
    'visible',
    {
      lean: true,
      new: true,
    }
  );
  return updatedWorkspace;
};

module.exports.deleteById = async (id) => {
  const deletedWorkspace = await WorkspaceModel.updateOneById(
    { field: 'workspace_id', value: id, otherOptions: { deleted: 'n' } },
    { deleted: 'y' },
    {
      lean: true,
      new: true,
    }
  );
  return deletedWorkspace;
};
