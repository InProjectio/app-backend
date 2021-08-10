const UserBlockRoute = require('express').Router();
const {
  getListUserBlock,
  createUserBlock,
  updateUserBlockById,
  deleteUserBlockById,
  getUserBlockDetail,
} = require('./controller');

UserBlockRoute.post('/', createUserBlock);
UserBlockRoute.get('/list', getListUserBlock);
UserBlockRoute.get('/:id', getUserBlockDetail);
UserBlockRoute.put('/:id', updateUserBlockById);
UserBlockRoute.delete('/:id', deleteUserBlockById);

module.exports = UserBlockRoute;
