const ProjectRoute = require('express').Router();
const PjController = require('./controller');
const { useToken } = require('../../middlewares/token');
const { withValidation } = require('../../middlewares/validation');
const validator = require('./validator');

ProjectRoute.get('/accept-invitation', PjController.acceptInvitation);
ProjectRoute.use(useToken);
ProjectRoute.get('/owner-projects', PjController.getOwnerProjects);
// GET
ProjectRoute.get('/list', PjController.getPjList);
ProjectRoute.get('/txhash/:txHash', PjController.getPjByTxHash);
ProjectRoute.get('/:id/is-visible', PjController.checkVisibleOrNot);
ProjectRoute.get('/:id/is-deleted', PjController.checkDeletedOrNot);
ProjectRoute.get('/:id/txhash', PjController.getTxHashById);
ProjectRoute.get('/:id/workspace-id', PjController.getWSIdById);
ProjectRoute.get('/:id', PjController.getPjById);
// POST
ProjectRoute.post('/invite-users/:pjId', PjController.inviteUsersToPJ);
ProjectRoute.post(
  '/resend-invite-email/:projectId',
  validator.resendMailSchema(),
  withValidation(PjController.resendInviteEmail),
  PjController.resendInviteEmail
);
ProjectRoute.post('/', PjController.createNewPj);

// PUT
ProjectRoute.put('/:id/switch-visible', PjController.switchVisibleStt);
ProjectRoute.put('/:id', PjController.updateById);

// DELETE
ProjectRoute.delete('/:id', PjController.deleteById);

module.exports = ProjectRoute;
