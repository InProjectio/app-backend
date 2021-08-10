const DB = require('../../utils/db');
const schemaInfo = require('./schema');
const userMappingSchema = require('./UserMapping')
const { comparePassword } = require('../../helpers/password');
const { generateToken } = require('../../helpers/token');
const { sendMail } = require('../../helpers/mail')
const { verifyToken } = require('../../helpers/token')
const { hashPassword } = require('../../helpers/password')

const UserModel = new DB(process.env.DB_NAME, schemaInfo);
const UserMappingModel = new DB(process.env.DB_NAME, userMappingSchema);

// Retrieve data

module.exports.getFriendList = async (fromUserId) => {
  let result = [];
  const query = {
    field: 'user_id',
    value: fromUserId,
  };
  const opt = { lean: true };
  const projection = '-_id friends';
  const userData = await UserModel.getOneById(query, opt, projection);
  if (userData && userData.friends && userData.friends.length > 0) {
    const userListQuery = {
      user_id: { $in: userData.friends },
    };
    const userListProjection = '-_id user_id email fullname role';
    const userList = await UserModel.getList(
      userListQuery,
      opt,
      userListProjection
    );
    result = userList;
  }
  return result;
};

module.exports.list = async () => {
  const query = {
    deleted: 'n',
  };
  const taskList = await UserModel.getList(query);
  return taskList;
};

module.exports.detail = async (id) => {
  const taskDetail = await UserModel.getOneById({
    field: 'task_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return taskDetail;
};

module.exports.getDetailByTxHash = async (txHash) => {
  const taskDetail = await UserModel.getOneById({
    field: 'txhash',
    value: txHash,
    otherOptions: { deleted: 'n' },
  });
  return taskDetail;
};

module.exports.getTxHashById = async (id) => {
  const taskDetail = await UserModel.getOneById({
    field: 'task_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return taskDetail.txhash + '';
};

module.exports.getFolderIdById = async (id) => {
  const taskDetail = await UserModel.getOneById({
    field: 'task_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return taskDetail.folder_id + '';
};

module.exports.checkIsDeletedOrNot = async (id) => {
  const taskDetail = await UserModel.getOneById({
    field: 'task_id',
    value: id,
  });
  return taskDetail.deleted === 'y' ? 'true' : 'false';
};

module.exports.signin = async (username, password, firebaseToken) => {
  const query = {
    field: 'username',
    value: username,
    otherOptions: { status: 'a' },
  };
  const projection =
    'user_id username email fullname password intro role public_key avatar_url';
  try {
    const user = await UserModel.getOneById(query, { lean: true }, projection);
    const userMapping = await UserMappingModel.model.findOne({
      user: user._id,
      status: 'ACTIVE',
      state: 'ACCEPT'
    })
    if (comparePassword(password, user.password) === false) {
      const loginFailed = new Error('Username or password is incorrect !');
      loginFailed.code = 404;
      throw loginFailed;
    }
    delete user['password'];
    const token = generateToken(user);
    if (firebaseToken) {
      await UserModel.model.findOneAndUpdate({
        user_id: user.user_id,
      }, {
        firebaseToken
      })
    }
    return {
      ...user,
      token,
      userMapping
    };
  } catch (error) {
    console.error(error);
    const loginFailed = new Error('Username or password is incorrect !');
    loginFailed.code = 404;
    throw loginFailed;
  }
};

module.exports.activeUserByUsername = async (username, email, otp) => {
  try {
    const query = {
      field: 'username',
      value: username,
      otherOptions: { email, email_otp: otp, status: 'd' },
    };
    const data = { status: 'a' };
    await UserModel.updateOneById(query, data);
    return 'true';
  } catch (error) {
    
    const invalidRequest = new Error(`OTP invalid !`);
    invalidRequest.code = 400;
    throw invalidRequest;

    return 'false';
  }
};

// Create new data

module.exports.add = async (data) => {
  UserModel.validateData(data);
  await UserModel.createNew({ ...data, status: 'd' });
  return 'true';
};

module.exports.signUp = async (data) => {
  const { email, password, username } = data;
  const user = await UserModel.model.findOne({ email, status: 'd' });
  if (user && !user.email_otp && !user.password && !user.username) {
    const usernameIsExist = await UserModel.isExist({ username });
    if (usernameIsExist) {
      const dupUsernameError = new Error('The username is already taken !');
      dupUsernameError.code = 400;
      throw dupUsernameError;
    }
    user.password = password;
    user.username = username;
    await user.save();
  } else {
    UserModel.validateData(data);
    const user = await UserModel.model.findOne({
      $or: [{
        email
      }, {
        username
      }]
    })
    if (user) {
      if (user.username === username) {
        const dupUsernameError = new Error('The username is already taken !');
        dupUsernameError.code = 400;
        throw dupUsernameError;
      } else {
        const dupUsernameError = new Error('The email is already taken !');
        dupUsernameError.code = 400;
        throw dupUsernameError;
      }
      
    }
    await UserModel.createNew({ ...data, status: 'd' });
  }
  return 'true';
};

// Update existed data

module.exports.updateById = async (id, data) => {
  const updatedUser = await UserModel.updateOneById(
    { field: 'task_id', value: id, otherOptions: { deleted: 'n' } },
    data,
    {
      lean: true,
      new: true,
    }
  );
  return updatedUser;
};

module.exports.switchVisibleStt = async (id) => {
  const updatedUser = await UserModel.switchStatus(
    { field: 'task_id', value: id, otherOptions: { deleted: 'n' } },
    'visible',
    {
      lean: true,
      new: true,
    }
  );
  return updatedUser;
};

module.exports.deleteById = async (id) => {
  const deletedUser = await UserModel.updateOneById(
    { field: 'task_id', value: id, otherOptions: { deleted: 'n' } },
    { deleted: 'y' },
    {
      lean: true,
      new: true,
    }
  );
  return deletedUser;
};


module.exports.updateProfile = async (userId, data) => {
  try {
    await UserModel.updateById(userId, data)
    return true
  } catch(e) {
    return Promise.reject(e)
  }
}

module.exports.changePassword = async (userId, data) => {
  try {
    const { oldPassword, newPassword } = data
    const user = await UserModel.getById(userId)
    if (comparePassword(oldPassword, user.password) === false) {
      const changePasswordFailed = new Error('Old password is incorrect !');
      changePasswordFailed.code = 404;
      throw changePasswordFailed;
    }

    user.password = newPassword
    await user.save()
    return true
  } catch(e) {
    return Promise.reject(e)
  }
}

const _sendInvitionMail = async (email) => {
  try {
    const token = generateToken({email}, { expiresIn: '1h' });
    const emailContent = `
    <div>
    <div>Please click the below button to change your password :</div>
    <div>
      <a href="${process.env.CLIENT_DOMAIN}/auth/change-password?token=${token}" style="height: 45px;width: 200px;border-radius: 10px;display: inline-block;line-height: 45px;text-decoration: none;text-align: center;font-size: 16px;color: white;background-color: mediumpurple;">Change password</>
    </div>
  </div>
`;
    await sendMail(email, '[InProject] forgot password', emailContent);
  } catch (error) {
    console.error(error);
  }
  return true;
};

module.exports.forgotPassword = async (data) => {
  try {
    const { email } = data
    const user = await UserModel.model.findOne({email})
    if (user) {
      await _sendInvitionMail(email)
    } else {
      const changePasswordFailed = new Error('User is not exist!');
      changePasswordFailed.code = 404;
      throw changePasswordFailed;
    }
    
    return true
  } catch(e) {
    return Promise.reject(e)
  }
}

module.exports.updatePassword = async (data) => {
  try {
    const { token, password } = data

    const decode = verifyToken(token)

    if (!decode || !decode.email) {
      const updatePasswordFailed = new Error('Request invalid');
      updatePasswordFailed.code = 403;
      throw updatePasswordFailed;
    }

    await UserModel.updateOne({
      email: decode.email
    }, {
      password: hashPassword(password)
    })
    return true
  } catch(e) {
    return Promise.reject(e)
  }
}

module.exports.getProfile = async (userId) => {
  try {
    const result = await UserModel.getById(userId, {}, '-password')

    return result
  } catch(e) {
    return Promise.reject(e)
  }
}

module.exports.sendContactEmail = async ({fullname, email, phone, message}) => {
  try {
    const token = generateToken({email}, { expiresIn: '1h' });
    const emailContent = `
    <div>
    <div>New contact :</div>
    <div>
      Fullname: ${fullname} <br />
      Email: ${email} <br />
      Phone: ${phone} <br />
      Message: ${message}
    </div>
  </div>
`;
    await sendMail('inprojectvn@gmail.com', '[InProject] New contact', emailContent);
    return true;
  } catch (error) {
    return Promise.reject(error)
  }
  
};
