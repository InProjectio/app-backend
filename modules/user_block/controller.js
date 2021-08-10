const { list, add, updateById, deleteById, detail } = require('./model');

const getListUserBlock = async (req, res, next) => {
  try {
    const result = await list();
    next(result);
  } catch (error) {
    next(error);
  }
};

const getUserBlockDetail = async (req, res, next) => {
  try {
    const userBlockId = req.params.id;
    const result = await detail(userBlockId);
    next(result);
  } catch (error) {
    next(error);
  }
};

const createUserBlock = async (req, res, next) => {
  try {
    const result = await add(req.body);
    next(result);
  } catch (error) {
    next(error);
  }
};

const updateUserBlockById = async (req, res, next) => {
  try {
    const userBlockId = req.params.id;
    const data = req.body;
    const result = await updateById(userBlockId, data);
    next(result);
  } catch (error) {
    next(error);
  }
};

const deleteUserBlockById = async (req, res, next) => {
  try {
    const userBlockId = req.params.id;
    const result = await deleteById(userBlockId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListUserBlock,
  getUserBlockDetail,
  createUserBlock,
  updateUserBlockById,
  deleteUserBlockById,
};
