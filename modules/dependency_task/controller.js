const { list, add, updateById, deleteById, detail } = require('./model');

const getListDepTask = async (req, res, next) => {
  try {
    const result = await list();
    next(result);
  } catch (error) {
    next(error);
  }
};

const getDepTaskDetail = async (req, res, next) => {
  try {
    const depTaskId = req.params.id;
    const result = await detail(depTaskId);
    next(result);
  } catch (error) {
    next(error);
  }
};

const createDepTask = async (req, res, next) => {
  try {
    const result = await add(req.body);
    next(result);
  } catch (error) {
    next(error);
  }
};

const updateDepTaskById = async (req, res, next) => {
  try {
    const depTaskId = req.params.id;
    const data = req.body;
    const result = await updateById(depTaskId, data);
    next(result);
  } catch (error) {
    next(error);
  }
};

const deleteDepTaskById = async (req, res, next) => {
  try {
    const depTaskId = req.params.id;
    const result = await deleteById(depTaskId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListDepTask,
  getDepTaskDetail,
  createDepTask,
  updateDepTaskById,
  deleteDepTaskById,
};
