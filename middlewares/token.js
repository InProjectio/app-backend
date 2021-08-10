const DB = require('../utils/db');
const userSchema = require('../modules/user/schema');
const { verifyToken } = require('../helpers/token');

const UserModel = new DB(process.env.DB_NAME, userSchema);

module.exports.useToken = async (req, res, next) => {
  try {
    const token = req.headers['user-token'] || null;
    if (!token) {
      const unAuthError = new Error('Token is not found !');
      unAuthError.code = 400;
      throw unAuthError;
    }
    const user = verifyToken(token);
    // console.log('user ===>', user)
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
