const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const TransactionModel = new DB(process.env.DB_NAME, schemaInfo);

// Retrieve data

module.exports.getTransactions = async (user_id, page = 1, pageSize = 10) => {
  const labelList = await TransactionModel.paginate({
    user_id
  }, {
    page,
    limit: pageSize,
    sort: { update_at: -1 },
  });
  return labelList;
};

module.exports.createTransaction = async (data, user_id) => {
  const transaction = await TransactionModel.createNew({
    ...data,
    user_id
  });
  return transaction;
};

module.exports.updateTransaction = async (data) => {
  try {
    console.log('test test ===>', data)
    const transaction = await TransactionModel.model.findOneAndUpdate({
      transaction_id: data.transaction_id
    }, data);
    return transaction;
  } catch(e) {
    console.log('error ===>', e)
    return Promise.reject(e)
  }
  
};
