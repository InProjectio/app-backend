const ActivityRoute = require('express').Router();
const ActController = require('./controller');

// GET
ActivityRoute.get('/list', ActController.getActList);
ActivityRoute.get('/txhash/:txHash', ActController.getActByTxHash);
ActivityRoute.get('/:id/is-deleted', ActController.checkDeletedOrNot);
ActivityRoute.get('/:id/txhash', ActController.getTxHashById);
ActivityRoute.get('/:id/task-id', ActController.getTaskIdById);
ActivityRoute.get('/:id', ActController.getActById);
// POST
ActivityRoute.post('/', ActController.createNewAct);

// PUT
ActivityRoute.put('/:id', ActController.updateById);

// DELETE
ActivityRoute.delete('/:id', ActController.deleteById);

module.exports = ActivityRoute;
