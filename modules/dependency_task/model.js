const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const DepTaskModel = new DB(process.env.DB_NAME, schemaInfo);

const list = async () => {
  const depTaskList = await DepTaskModel.getList();
  return depTaskList;
};

const detail = async (id) => {
  const depTaskDetail = await DepTaskModel.getById(id);
  return depTaskDetail;
};

const add = async (data) => {
  DepTaskModel.validateData(data);
  const newDepTask = await DepTaskModel.createNew(data);
  return newDepTask;
};

const updateById = async (id, data) => {
  const updatedDepTask = await DepTaskModel.updateById(id, data, {
    lean: true,
    new: true,
  });
  return updatedDepTask;
};

const deleteById = async (id) => {
  const deletedDepTask = await DepTaskModel.deleteById(id, {
    lean: true,
  });
  return deletedDepTask;
};

module.exports = {
  list,
  add,
  updateById,
  deleteById,
  detail,
};
