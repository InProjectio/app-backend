const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const BlockModel = new DB(process.env.DB_NAME, schemaInfo);

const list = async () => {
  const blockList = await BlockModel.getList();
  return blockList;
};

const detail = async (id) => {
  const blockDetail = await BlockModel.getById(id);
  return blockDetail;
};

const add = async (data) => {
  BlockModel.validateData(data);
  const newBlock = await BlockModel.createNew(data);
  return newBlock;
};

const updateById = async (id, data) => {
  const updatedBlock = await BlockModel.updateById(id, data, {
    lean: true,
    new: true,
  });
  return updatedBlock;
};

const deleteById = async (id) => {
  const deletedBlock = await BlockModel.deleteById(id, {
    lean: true,
  });
  return deletedBlock;
};

module.exports = {
  list,
  add,
  updateById,
  deleteById,
  detail,
};
