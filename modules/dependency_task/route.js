const DepTaskRoute = require('express').Router();
const {
  getListDepTask,
  createDepTask,
  updateDepTaskById,
  deleteDepTaskById,
  getDepTaskDetail,
} = require('./controller');

DepTaskRoute.post('/', createDepTask);
DepTaskRoute.get('/list', getListDepTask);
DepTaskRoute.get('/:id', getDepTaskDetail);
DepTaskRoute.put('/:id', updateDepTaskById);
DepTaskRoute.delete('/:id', deleteDepTaskById);

module.exports = DepTaskRoute;
