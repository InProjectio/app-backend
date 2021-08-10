const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const TaskLabelModel = new DB(process.env.DB_NAME, schemaInfo);

const list = async () => {
  const taskLabelList = await TaskLabelModel.getList();
  return taskLabelList;
};

const detail = async (id) => {
  const taskLabelDetail = await TaskLabelModel.getById(id);
  return taskLabelDetail;
};

const add = async (data) => {
  TaskLabelModel.validateData(data);
  const newTaskLabel = await TaskLabelModel.createNew(data);
  return newTaskLabel;
};

const updateById = async (id, data) => {
  const updatedTaskLabel = await TaskLabelModel.updateById(id, data, {
    lean: true,
    new: true,
  });
  return updatedTaskLabel;
};

const deleteById = async (id) => {
  const deletedTaskLabel = await TaskLabelModel.deleteById(id, {
    lean: true,
  });
  return deletedTaskLabel;
};

module.exports = {
  list,
  add,
  updateById,
  deleteById,
  detail,
};
