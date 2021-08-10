const PjUserRoute = require('express').Router();
const PjUserController = require('./controller');
const { useToken } = require('../../middlewares/token');

PjUserRoute.use(useToken);

// GET
PjUserRoute.get('/list', PjUserController.getPjUserList);
PjUserRoute.get('/user-list/:projectId', PjUserController.getUsersByProjectId);
PjUserRoute.get('/project-list/:userId', PjUserController.getProjectsByUserId);
PjUserRoute.get('/role/:projectId/:userId', PjUserController.getRole);
PjUserRoute.get('/is-owner/:projectId/:userId', PjUserController.checkIsOwner);
PjUserRoute.get('/txhash/:txHash', PjUserController.getPjUserDetailByTxhash);
PjUserRoute.get('/:projectId/:userId', PjUserController.getPjUserDetail);
// POST
PjUserRoute.post('/', PjUserController.createNewPjUser);

// PUT
PjUserRoute.put('/:projectId/:userId', PjUserController.updateById);

// DELETE
PjUserRoute.delete('/:projectId/:userId', PjUserController.deleteById);

module.exports = PjUserRoute;
