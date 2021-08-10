const { list, add, updateById, deleteById, detail } = require('./model');

const getListBlock = async (req, res, next) => {
  try {
    const result = await list();
    next(result);
  } catch (error) {
    next(error);
  }
};

const getBlockDetail = async (req, res, next) => {
  try {
    const blockId = req.params.id;
    const result = await detail(blockId);
    next(result);
  } catch (error) {
    next(error);
  }
};

const createBlock = async (req, res, next) => {
  try {
    const result = await add(req.body);
    next(result);
  } catch (error) {
    next(error);
  }
};

const updateBlockById = async (req, res, next) => {
  try {
    const blockId = req.params.id;
    const data = req.body;
    const result = await updateById(blockId, data);
    next(result);
  } catch (error) {
    next(error);
  }
};

const deleteBlockById = async (req, res, next) => {
  try {
    const blockId = req.params.id;
    const result = await deleteById(blockId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListBlock,
  getBlockDetail,
  createBlock,
  updateBlockById,
  deleteBlockById,
};
