const TaskLabelRoute = require('express').Router();
const {
  getListTaskLabel,
  createTaskLabel,
  updateTaskLabelById,
  deleteTaskLabelById,
  getTaskLabelDetail,
} = require('./controller');

TaskLabelRoute.post('/', createTaskLabel);
TaskLabelRoute.get('/list', getListTaskLabel);
TaskLabelRoute.get('/:id', getTaskLabelDetail);
TaskLabelRoute.put('/:id', updateTaskLabelById);
TaskLabelRoute.delete('/:id', deleteTaskLabelById);

module.exports = TaskLabelRoute;
