const UserModel = require('./model');
const {
  getUsersInProject,
  getUsersInWorkspace,
} = require('../../combine_operations/user');
const { cvtToNumber } = require('../../helpers/transform_data');
const { sendNotificationToClient } = require('../../helpers/notify')

// Retrieve data
module.exports.getFriendList = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const friendList = await UserModel.getFriendList(userId);
    next(friendList);
  } catch (error) {
    next(error);
  }
};

module.exports.getUsersInProject = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const projectId = req.params.projectId;
    const result = await getUsersInProject(projectId, userId);
    next(result);
  } catch (error) {
    next(error);
  }
};
module.exports.getUsersInWorkspace = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const workspaceId = req.params.workspaceId;
    const result = await getUsersInWorkspace(workspaceId, userId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserList = async (req, res, next) => {
  try {
    const result = await UserModel.list();
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await UserModel.detail(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserByTxHash = async (req, res, next) => {
  try {
    const txHash = req.params.txHash;
    const result = await UserModel.getDetailByTxHash(txHash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTxHashById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await UserModel.getTxHashById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getFolderIdById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await UserModel.getFolderIdById(id);
    next(cvtToNumber(result));
  } catch (error) {
    next(error);
  }
};

module.exports.checkDeletedOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await UserModel.checkIsDeletedOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewUser = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const result = await UserModel.add(queryBody);
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
    const result = await UserModel.updateById(id, queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await UserModel.deleteById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.signUp = async (req, res, next) => {
  try {
    const queryBody = req.body;
    const result = await UserModel.signUp(queryBody);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.activeUser = async (req, res, next) => {
  try {
    const username = req.query.username || null;
    const email = req.query.email || null;
    const otpCode = req.query.otp_code || null;
    if (!username || !email || !otpCode) {
      const invalidRequest = new Error(`You're making a invalid request !`);
      invalidRequest.code = 400;
      throw invalidRequest;
    }
    const result = await UserModel.activeUserByUsername(
      username,
      email,
      otpCode
    );
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.signIn = async (req, res, next) => {
  try {
    const { username, password, firebaseToken } = req.body;
    const result = await UserModel.signin(username, password, firebaseToken);
    next(result);
  } catch (error) {
    next(error);
  }
};


module.exports.updateProfile = async (req, res, next) => {
  try {
    const data = req.body;
    const userId = req.user._id;
    const result = await UserModel.updateProfile(userId, data);
    next(result);
  } catch (error) {
    next(error);
  }
}

module.exports.changePassword = async (req, res, next) => {
  try {
    const data = req.body;
    const userId = req.user._id;
    const result = await UserModel.changePassword(userId, data);
    next(result);
  } catch (error) {
    next(error);
  }
}

module.exports.forgotPassword = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await UserModel.forgotPassword(data);
    next(result);
  } catch (error) {
    next(error);
  }
}

module.exports.updatePassword = async (req, res, next) => {
  try {
    const data = req.body;
    const result = await UserModel.updatePassword(data);
    next(result);
  } catch (error) {
    next(error);
  }
}

module.exports.getProfile = async (req, res, next) => {
  try {
    const result = await UserModel.getProfile(req.user._id);
    next(result);
  } catch (error) {
    next(error);
  }
}

module.exports.contact = async (req, res, next) => {
  try {
    await UserModel.sendContactEmail(req.body)
    next(true);
  } catch (error) {
    next(error);
  }
}

module.exports.testPush = async (req, res, next) => {
  try {
    sendNotificationToClient([req.body.token], {
      title: 'test',
      body: 'test',
      data: JSON.stringify({
        name: 'Tung',
        lastName: 'Dao'
      }),
    })
    next(true);
  } catch (error) {
    next(error);
  }
}