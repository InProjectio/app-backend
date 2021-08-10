const CLItemUserRoute = require('express').Router();
const CLItemUserController = require('./controller');

// GET
CLItemUserRoute.get('/list', CLItemUserController.getCLItemUserList);
CLItemUserRoute.get(
  '/txhash/:txHash',
  CLItemUserController.getCLItemUserByTxHash
);
CLItemUserRoute.get('/:id/txhash', CLItemUserController.getTxHashById);
CLItemUserRoute.get(
  '/:id/is-assigner',
  CLItemUserController.checkIsAssignerOrNot
);
CLItemUserRoute.get(
  '/:id/is-assignee',
  CLItemUserController.checkIsAssigneeOrNot
);
CLItemUserRoute.get('/:id', CLItemUserController.getCLItemUserById);
// POST
CLItemUserRoute.post('/', CLItemUserController.createNewCLItemUser);

// PUT
CLItemUserRoute.put('/:id', CLItemUserController.updateById);

// DELETE
CLItemUserRoute.delete('/:id', CLItemUserController.deleteById);

module.exports = CLItemUserRoute;
