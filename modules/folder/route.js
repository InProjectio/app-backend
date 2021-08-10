const FolderRoute = require('express').Router();
const FolderController = require('./controller');

// GET
FolderRoute.get('/list', FolderController.getFolderList);
FolderRoute.get('/txhash/:txHash', FolderController.getFolderByTxHash);
FolderRoute.get('/:id/is-deleted', FolderController.checkDeletedOrNot);
FolderRoute.get('/:id/is-visible', FolderController.checkVisibleOrNot);
FolderRoute.get('/:id/txhash', FolderController.getTxHashById);
FolderRoute.get('/:id/project-id', FolderController.getPJIdById);
FolderRoute.get('/:id', FolderController.getFolderById);
// POST
FolderRoute.post('/', FolderController.createNewFolder);

// PUT
FolderRoute.put('/:id', FolderController.updateById);

// DELETE
FolderRoute.delete('/:id', FolderController.deleteById);

module.exports = FolderRoute;
