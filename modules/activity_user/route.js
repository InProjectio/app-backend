const AcUserRoute = require('express').Router();
const {
  getListAcUser,
  createAcUser,
  updateAcUserById,
  deleteAcUserById,
  getAcUserDetail,
} = require('./controller');

AcUserRoute.post('/', createAcUser);
AcUserRoute.get('/list', getListAcUser);
AcUserRoute.get('/:id', getAcUserDetail);
AcUserRoute.put('/:id', updateAcUserById);
AcUserRoute.delete('/:id', deleteAcUserById);

module.exports = AcUserRoute;
