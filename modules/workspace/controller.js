const WorkspaceModel = require('./model');
const {
  getWSListOfDetail,
  inviteUsersToWorkspace,
  acceptInvitation,
  resendInvitationMail,
  createNew,
} = require('../../combine_operations/workspace');

// Retrieve data

module.exports.resendInviteEmail = async (req, res, next) => {
  const currentUser = req.user.usser_id;
  const workspaceId = req.params.workspaceId;
  const emails = req.body.emails;
  const result = await resendInvitationMail(workspaceId, emails, currentUser);
  next(result);
};

module.exports.acceptInvitation = async (req, res, next) => {
  try {
    const token = req.query.token;
    const result = await acceptInvitation(token);
    next(result);
  } catch (error) {
    if (error && error.name === 'TokenExpiredError') {
      const expireError = new Error(
        'The invitation is expired, please contact to the sender'
      );
      expireError.code = 400;
      return next(expireError);
    }
    next(error);
  }
};

module.exports.inviteUsersToWS = async (req, res, next) => {
  try {
    const wsId = req.params.wsId;
    const users = req.body.users || [];
    const currentUserId = req.user.user_id;
    const result = await inviteUsersToWorkspace(wsId, users, currentUserId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getListOfDetail = async (req, res, next) => {
  try {
    const result = await getWSListOfDetail(req.user);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getWSList = async (req, res, next) => {
  try {
    const result = await WorkspaceModel.list();
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getWSById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await WorkspaceModel.detail(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getWSByTxHash = async (req, res, next) => {
  try {
    const txHash = req.params.txHash;
    const result = await WorkspaceModel.getDetailByTxHash(txHash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTxHashById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await WorkspaceModel.getTxHashById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkVisibleOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await WorkspaceModel.checkIsVisibleOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkDeletedOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await WorkspaceModel.checkIsDeletedOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewWS = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const currentUser = req.user.user_id;
    const result = await createNew(currentUser, queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Update data
module.exports.updateById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const queryBody = req.body;
    const result = await WorkspaceModel.updateById(id, queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.switchVisibleStt = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await WorkspaceModel.switchVisibleStt(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await WorkspaceModel.deleteById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};
