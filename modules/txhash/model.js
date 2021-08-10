const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const TxhashModel = new DB(process.env.DB_NAME, schemaInfo);

// Retrieve data

module.exports.list = async () => {
  const query = {};
  const txhashList = await TxhashModel.getList(query);
  return txhashList;
};

module.exports.detail = async (txhash) => {
  const txhashDetail = await TxhashModel.getOneById({
    field: 'txhash',
    value: txhash,
  });
  return txhashDetail;
};

module.exports.getTxhashsUserId = async (userId) => {
  const query = {
    user_id: userId,
  };
  const txhashList = await TxhashModel.getList(query);
  return txhashList;
};

module.exports.getTxHashById = async (id) => {
  const txhashDetail = await TxhashModel.getOneById({
    field: 'txhash_id',
    value: id,
  });
  return txhashDetail.txhash + '';
};

module.exports.getTaskIdById = async (id) => {
  const txhashDetail = await TxhashModel.getOneById({
    field: 'txhash_id',
    value: id,
  });
  return txhashDetail.task_id + '';
};

module.exports.checkIsOutdate = async (txhash) => {
  const txhashDetail = await TxhashModel.getOneById({
    field: 'txhash',
    value: txhash,
  });
  return txhashDetail.is_newest === 'n' ? 'true' : 'false';
};

module.exports.checkIsDeletedOrNot = async (id) => {
  const txhashDetail = await TxhashModel.getOneById({
    field: 'txhash_id',
    value: id,
  });
  return txhashDetail.deleted === 'y' ? 'true' : 'false';
};

// Create new data

module.exports.add = async (data) => {
  TxhashModel.validateData(data);
  const newTxhash = await TxhashModel.createNew(data);
  return newTxhash;
};

// Update existed data

module.exports.updateById = async (id, data) => {
  const updatedTxhash = await TxhashModel.updateOneById(
    { field: 'txhash_id', value: id },
    data,
    {
      lean: true,
      new: true,
    }
  );
  return updatedTxhash;
};

module.exports.switchVisibleStt = async (id) => {
  const updatedTxhash = await TxhashModel.switchStatus(
    { field: 'txhash_id', value: id },
    'visible',
    {
      lean: true,
      new: true,
    }
  );
  return updatedTxhash;
};

module.exports.deleteById = async (id) => {
  const deletedTxhash = await TxhashModel.deleteOneById({
    field: 'txhash_id',
    value: id,
  });
  return deletedTxhash;
};
