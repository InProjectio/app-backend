const LabelRoute = require('express').Router();
const LabelController = require('./controller');
const { useToken } = require("../../middlewares/token");


LabelRoute.use(useToken);

// GET
LabelRoute.get('/list', LabelController.getLabelList);
LabelRoute.get('/:id', LabelController.getLabelById);
// POST
LabelRoute.post('/', LabelController.createNewLabel);

// PUT
LabelRoute.put('/:id', LabelController.updateById);

// DELETE
LabelRoute.delete('/:id', LabelController.deleteById);

module.exports = LabelRoute;
