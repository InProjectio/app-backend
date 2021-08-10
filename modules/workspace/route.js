const WorkspaceRoute = require('express').Router();
const WSController = require('./controller');
const { useToken } = require('../../middlewares/token');
const { withValidation } = require('../../middlewares/validation');
const validator = require('./validator');

WorkspaceRoute.get('/accept-invitation', WSController.acceptInvitation);

WorkspaceRoute.use(useToken);

// GET
WorkspaceRoute.get('/list-detail', WSController.getListOfDetail);
WorkspaceRoute.get('/list', WSController.getWSList);
WorkspaceRoute.get('/txhash/:txHash', WSController.getWSByTxHash);
WorkspaceRoute.get('/:id/is-visible', WSController.checkVisibleOrNot);
WorkspaceRoute.get('/:id/is-deleted', WSController.checkDeletedOrNot);
WorkspaceRoute.get('/:id/txhash', WSController.getTxHashById);
WorkspaceRoute.get('/:id', WSController.getWSById);
// POST
WorkspaceRoute.post('/invite-users/:wsId', WSController.inviteUsersToWS);
WorkspaceRoute.post(
  '/resend-invite-email/:workspaceId',
  validator.resendMailSchema(),
  withValidation(WSController.resendInviteEmail),
  WSController.resendInviteEmail
);
WorkspaceRoute.post('/', WSController.createNewWS);

// PUT
WorkspaceRoute.put('/:id/switch-visible', WSController.switchVisibleStt);
WorkspaceRoute.put('/:id', WSController.updateById);

// DELETE
WorkspaceRoute.delete('/:id', WSController.deleteById);

module.exports = WorkspaceRoute;
