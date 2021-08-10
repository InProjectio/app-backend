const CLItemRoute = require('express').Router();
const CLItemController = require('./controller');

// GET
CLItemRoute.get('/list', CLItemController.getCLItemList);
CLItemRoute.get('/txhash/:txHash', CLItemController.getCLItemByTxHash);
CLItemRoute.get('/:id/is-deleted', CLItemController.checkDeletedOrNot);
CLItemRoute.get('/:id/txhash', CLItemController.getTxHashById);
CLItemRoute.get('/:id/checklist-id', CLItemController.getCLIdById);
CLItemRoute.get('/:id', CLItemController.getCLItemById);
// POST
CLItemRoute.post('/', CLItemController.createNewCLItem);

// PUT
CLItemRoute.put('/:id', CLItemController.updateById);

// DELETE
CLItemRoute.delete('/:id', CLItemController.deleteById);

module.exports = CLItemRoute;
