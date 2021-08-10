const UserRoute = require('express').Router();
const UserController = require('./controller');
const { useToken } = require('../../middlewares/token');
const { withValidation } = require('../../middlewares/validation');
const validator = require('./validator');

// GET
// UserRoute.get('/list', UserController.getUserList);
// UserRoute.get('/txhash/:txHash', UserController.getUserByTxHash);
// UserRoute.get('/:id/is-deleted', UserController.checkDeletedOrNot);
// UserRoute.get('/:id/txhash', UserController.getTxHashById);
// UserRoute.get('/:id/folder-id', UserController.getFolderIdById);
// UserRoute.get('/:id', UserController.getUserById);
UserRoute.post('/contact', UserController.contact)
UserRoute.get('/profile', useToken, UserController.getProfile)
UserRoute.get('/friends', useToken, UserController.getFriendList);
UserRoute.get(
  '/users-in-project/:projectId',
  useToken,
  UserController.getUsersInProject
);
UserRoute.get(
  '/users-in-workspace/:workspaceId',
  useToken,
  UserController.getUsersInWorkspace
);
UserRoute.get('/active-user', UserController.activeUser);
// POST
UserRoute.post(
  '/sign-up',
  validator.signUpValidate(),
  withValidation(UserController.signUp)
);
UserRoute.post('/sign-in', UserController.signIn);

// PUT
UserRoute.put('/update-profile', useToken, UserController.updateProfile);

UserRoute.post('/change-password', useToken, UserController.changePassword);

UserRoute.post('/forgot-password', UserController.forgotPassword);

UserRoute.post('/update-password', UserController.updatePassword);

UserRoute.post('/test-push', UserController.testPush);
// DELETE
// UserRoute.delete('/:id', UserController.deleteById);

module.exports = UserRoute;
