const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const AcUserModel = new DB(process.env.DB_NAME, schemaInfo);

const list = async () => {
  const acUserList = await AcUserModel.getList();
  return acUserList;
};

const detail = async (id) => {
  const acUserDetail = await AcUserModel.getById(id);
  return acUserDetail;
};

const add = async (data) => {
  AcUserModel.validateData(data);
  const newAcUser = await AcUserModel.createNew(data);
  return newAcUser;
};

const updateById = async (id, data) => {
  const updatedAcUser = await AcUserModel.updateById(id, data, {
    lean: true,
    new: true,
  });
  return updatedAcUser;
};

const deleteById = async (id) => {
  const deletedAcUser = await AcUserModel.deleteById(id, {
    lean: true,
  });
  return deletedAcUser;
};

module.exports = {
  list,
  add,
  updateById,
  deleteById,
  detail,
};
