const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const UserBlockModel = new DB(process.env.DB_NAME, schemaInfo);

const list = async () => {
  const userBlockList = await UserBlockModel.getList();
  return userBlockList;
};

const detail = async (id) => {
  const userBlockDetail = await UserBlockModel.getById(id);
  return userBlockDetail;
};

const add = async (data) => {
  UserBlockModel.validateData(data);
  const newUserBlock = await UserBlockModel.createNew(data);
  return newUserBlock;
};

const updateById = async (id, data) => {
  const updatedUserBlock = await UserBlockModel.updateById(id, data, {
    lean: true,
    new: true,
  });
  return updatedUserBlock;
};

const deleteById = async (id) => {
  const deletedUserBlock = await UserBlockModel.deleteById(id, {
    lean: true,
  });
  return deletedUserBlock;
};

module.exports = {
  list,
  add,
  updateById,
  deleteById,
  detail,
};
