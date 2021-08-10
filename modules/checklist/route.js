const ChecklistRoute = require('express').Router();
const CLController = require('./controller');

// GET
ChecklistRoute.get('/list', CLController.getCLList);
ChecklistRoute.get('/txhash/:txHash', CLController.getCLByTxHash);
ChecklistRoute.get('/:id/is-deleted', CLController.checkDeletedOrNot);
ChecklistRoute.get('/:id/txhash', CLController.getTxHashById);
ChecklistRoute.get('/:id/task-id', CLController.getTaskIdById);
ChecklistRoute.get('/:id', CLController.getCLById);
// POST
ChecklistRoute.post('/', CLController.createNewCL);

// PUT
ChecklistRoute.put('/:id', CLController.updateById);

// DELETE
ChecklistRoute.delete('/:id', CLController.deleteById);

module.exports = ChecklistRoute;
