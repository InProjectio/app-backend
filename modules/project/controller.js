const ProjectModel = require('./model');
const {
  inviteUsersToProject,
  acceptInvitation,
  resendInvitationMail,
  createNew,
  getProjects
} = require('../../combine_operations/project');
const { cvtToNumber } = require('../../helpers/transform_data');

// Retrieve data

module.exports.resendInviteEmail = async (req, res, next) => {
  const currentUser = req.user.usser_id;
  const projectId = req.params.projectId;
  const emails = req.body.emails;
  const result = await resendInvitationMail(projectId, emails, currentUser);
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

module.exports.inviteUsersToPJ = async (req, res, next) => {
  try {
    const pjId = req.params.pjId;
    const users = req.body.users || [];
    const currentUserId = req.user.user_id;
    const result = await inviteUsersToProject(pjId, users, currentUserId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getPjList = async (req, res, next) => {
  try {
    const result = await ProjectModel.list();
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getPjById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ProjectModel.detail(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getPjByTxHash = async (req, res, next) => {
  try {
    const txHash = req.params.txHash;
    const result = await ProjectModel.getDetailByTxHash(txHash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTxHashById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ProjectModel.getTxHashById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getWSIdById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ProjectModel.getWSIdById(id);
    next(cvtToNumber(result));
  } catch (error) {
    next(error);
  }
};

module.exports.checkVisibleOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ProjectModel.checkIsVisibleOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkDeletedOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ProjectModel.checkIsDeletedOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewPj = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const currentUserId = req.user.user_id;
    const result = await createNew(currentUserId, queryBody);
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
    const result = await ProjectModel.updateById(id, queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.switchVisibleStt = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ProjectModel.switchVisibleStt(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await ProjectModel.deleteById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getOwnerProjects = async (req, res, next) => {
  try {
    const result = await getProjects(req.user)
    next(result);
  } catch (error) {
    next(error);
  }
};
