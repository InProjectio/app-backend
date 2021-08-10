const WSUserModel = require('./model');

// Retrieve data

// module.exports.getWSUserList = async (req, res, next) => {
//   try {
//     const result = await WSUserModel.list();
//     next(result);
//   } catch (error) {
//     next(error);
//   }
// };

module.exports.getWSUserById = async (req, res, next) => {
  try {
    const wsId = req.params.wsId;
    const userId = req.params.userId;
    const result = await WSUserModel.detail(wsId, userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getWSUserByTxHash = async (req, res, next) => {
  try {
    const txHash = req.params.txHash;
    const result = await WSUserModel.getDetailByTxHash(txHash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkIsOwner = async (req, res, next) => {
  try {
    const wsId = req.params.wsId;
    const userId = req.params.userId;
    const result = await WSUserModel.checkIsOwnerOrNot(wsId, userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getRole = async (req, res, next) => {
  try {
    const wsId = req.params.wsId;
    const userId = req.params.userId;
    const result = await WSUserModel.getRole(wsId, userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getWSListByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const result = await WSUserModel.getWorkspacesByUserId(userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserListByWS = async (req, res, next) => {
  try {
    const wsId = req.params.wsId;
    const result = await WSUserModel.getUsersByWSId(wsId);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewWSUser = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const result = await WSUserModel.add(queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Update data

module.exports.updateById = async (req, res, next) => {
  try {
    const wsId = req.params.wsId;
    const userId = req.params.userId;
    const queryBody = req.body;
    delete queryBody['is_owner'];
    const requestUserId = req.user.user_id;
    const result = await WSUserModel.updateById(
      requestUserId,
      wsId,
      userId,
      queryBody
    );
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const wsId = req.params.wsId;
    const userId = req.params.userId;
    const requestUserId = req.user.user_id;
    const result = await WSUserModel.deleteById(requestUserId, wsId, userId);
    next(result);
  } catch (error) {
    next(error);
  }
};
