const TxhashRoute = require('express').Router();
const TxhashController = require('./controller');

// GET
// TxhashRoute.get('/list', TxhashController.getTxhashList);
TxhashRoute.get('/:txhash/is-outdate', TxhashController.checkIsOutdate);
TxhashRoute.get('/:txhash', TxhashController.getTxhashById);
// POST
TxhashRoute.post('/', TxhashController.createNewTxhash);

// PUT
// TxhashRoute.put('/:id', TxhashController.updateById);

// DELETE
// TxhashRoute.delete('/:id', TxhashController.deleteById);

module.exports = TxhashRoute;
