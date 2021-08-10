const WSUserRoute = require('express').Router();
const WSUserController = require('./controller');
const { useToken } = require('../../middlewares/token');

WSUserRoute.use(useToken);

// GET
WSUserRoute.get('/txhash/:txHash', WSUserController.getWSUserByTxHash);
WSUserRoute.get('/workspace-list/:userId', WSUserController.getWSListByUser);
WSUserRoute.get('/user-list/:wsId', WSUserController.getUserListByWS);
WSUserRoute.get('/:wsId/:userId/is-owner', WSUserController.checkIsOwner);
WSUserRoute.get('/:wsId/:userId/role', WSUserController.getRole);
WSUserRoute.get('/:wsId/:userId', WSUserController.getWSUserById);
// POST
WSUserRoute.post('/', WSUserController.createNewWSUser);

// PUT
WSUserRoute.put('/:wsId/:userId', WSUserController.updateById);

// DELETE
WSUserRoute.delete('/:wsId/:userId', WSUserController.deleteById);

module.exports = WSUserRoute;
