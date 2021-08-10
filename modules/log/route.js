const LogRoute = require('express').Router();
const LogController = require('./controller');

// GET
LogRoute.get('/list', LogController.getLogList);
LogRoute.get('/list/:userId', LogController.getLogsByUserId);
LogRoute.get('/:id', LogController.getLogById);
// POST
LogRoute.post('/', LogController.createNewLog);

// PUT
// LogRoute.put('/:id', LogController.updateById);

// DELETE
// LogRoute.delete('/:id', LogController.deleteById);

module.exports = LogRoute;
