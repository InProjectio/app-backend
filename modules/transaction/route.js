const TransactionRoute = require('express').Router();
const TransactionController = require('./controller');
const { useToken } = require("../../middlewares/token");


TransactionRoute.use(useToken);

// GET
TransactionRoute.get('/list', TransactionController.getTransactions);
// POST
TransactionRoute.post('/', TransactionController.createTransaction);

// PUT
TransactionRoute.put('/', TransactionController.updateTransaction);


module.exports = TransactionRoute;
