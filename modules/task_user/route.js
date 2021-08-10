const TaskUserRoute = require('express').Router();
const TaskUserController = require('./controller');

// GET
TaskUserRoute.get('/list', TaskUserController.getTaskUserList);
TaskUserRoute.get('/txhash/:txHash', TaskUserController.getTaskUserByTxHash);
TaskUserRoute.get(
  '/:taskId/:userId/is-assignee',
  TaskUserController.checkIsAssigneeOrNot
);
TaskUserRoute.get(
  '/:taskId/:userId/is-owner',
  TaskUserController.checkIsOwnerOrNot
);
TaskUserRoute.get(
  '/:taskId/:userId/is-watch',
  TaskUserController.checkIsWatchOrNot
);
TaskUserRoute.get('/:taskId/:userId', TaskUserController.getTaskUserById);
// POST
TaskUserRoute.post('/', TaskUserController.createNewTaskUser);

// PUT
TaskUserRoute.put(
  '/transfer/:taskId/:oldUserId/:newUserId',
  TaskUserController.updateById
);
TaskUserRoute.put('/:taskId/:userId', TaskUserController.updateById);

// DELETE
TaskUserRoute.delete('/:taskId/:userId', TaskUserController.deleteById);

module.exports = TaskUserRoute;
