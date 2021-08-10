const BlockRoute = require('express').Router();
const {
  getListBlock,
  createBlock,
  updateBlockById,
  deleteBlockById,
  getBlockDetail,
} = require('./controller');

BlockRoute.post('/', createBlock);
BlockRoute.get('/list', getListBlock);
BlockRoute.get('/:id', getBlockDetail);
BlockRoute.put('/:id', updateBlockById);
BlockRoute.delete('/:id', deleteBlockById);

module.exports = BlockRoute;
