const TransactionModel = require('./model');

// Retrieve data

module.exports.getTransactions = async (req, res, next) => {
  try {
    const query = req.query
    const result = await TransactionModel.getTransactions(req.user.user_id, query.page);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.createTransaction = async (req, res, next) => {
  try {
    const result = await TransactionModel.createTransaction(req.body, req.user.user_id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.updateTransaction = async (req, res, next) => {
  try {
    const result = await TransactionModel.updateTransaction(req.body);
    next(result);
  } catch (error) {
    next(error);
  }
};

