const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const ProjectModel = new DB(process.env.DB_NAME, schemaInfo);

// Retrieve data

module.exports.list = async () => {
  const query = {
    deleted: 'n',
  };
  const projectList = await ProjectModel.getList(query);
  return projectList;
};

module.exports.detail = async (id) => {
  const projectDetail = await ProjectModel.getOneById({
    field: 'project_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return projectDetail;
};

module.exports.getDetailByTxHash = async (txHash) => {
  const projectDetail = await ProjectModel.getOneById({
    field: 'txhash',
    value: txHash,
    otherOptions: { deleted: 'n' },
  });
  return projectDetail;
};

module.exports.getTxHashById = async (id) => {
  const projectDetail = await ProjectModel.getOneById({
    field: 'project_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return projectDetail.txhash + '';
};

module.exports.getWSIdById = async (id) => {
  const projectDetail = await ProjectModel.getOneById({
    field: 'project_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return projectDetail.workspace_id + '';
};

module.exports.checkIsVisibleOrNot = async (id) => {
  const projectDetail = await ProjectModel.getOneById({
    field: 'project_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return projectDetail.visible === 'y' ? 'true' : 'false';
};

module.exports.checkIsDeletedOrNot = async (id) => {
  const projectDetail = await ProjectModel.getOneById({
    field: 'project_id',
    value: id,
  });
  return projectDetail.deleted === 'y' ? 'true' : 'false';
};

// Create new data

module.exports.add = async (data) => {
  ProjectModel.validateData(data);
  const newProject = await ProjectModel.createNew(data);
  return newProject;
};

// Update existed data

module.exports.updateById = async (id, data) => {
  const updatedProject = await ProjectModel.updateOneById(
    { field: 'project_id', value: id, otherOptions: { deleted: 'n' } },
    data,
    {
      lean: true,
      new: true,
    }
  );
  return updatedProject;
};

module.exports.switchVisibleStt = async (id) => {
  const updatedProject = await ProjectModel.switchStatus(
    { field: 'project_id', value: id, otherOptions: { deleted: 'n' } },
    'visible',
    {
      lean: true,
      new: true,
    }
  );
  return updatedProject;
};

module.exports.deleteById = async (id) => {
  const deletedProject = await ProjectModel.updateOneById(
    { field: 'project_id', value: id, otherOptions: { deleted: 'n' } },
    { deleted: 'y' },
    {
      lean: true,
      new: true,
    }
  );
  return deletedProject;
};
