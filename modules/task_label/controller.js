const { list, add, updateById, deleteById, detail } = require('./model');

const getListTaskLabel = async (req, res, next) => {
  try {
    const result = await list();
    next(result);
  } catch (error) {
    next(error);
  }
};

const getTaskLabelDetail = async (req, res, next) => {
  try {
    const taskLabelId = req.params.id;
    const result = await detail(taskLabelId);
    next(result);
  } catch (error) {
    next(error);
  }
};

const createTaskLabel = async (req, res, next) => {
  try {
    const result = await add(req.body);
    next(result);
  } catch (error) {
    next(error);
  }
};

const updateTaskLabelById = async (req, res, next) => {
  try {
    const taskLabelId = req.params.id;
    const data = req.body;
    const result = await updateById(taskLabelId, data);
    next(result);
  } catch (error) {
    next(error);
  }
};

const deleteTaskLabelById = async (req, res, next) => {
  try {
    const taskLabelId = req.params.id;
    const result = await deleteById(taskLabelId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListTaskLabel,
  getTaskLabelDetail,
  createTaskLabel,
  updateTaskLabelById,
  deleteTaskLabelById,
};
