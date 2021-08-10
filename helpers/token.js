const jwt = require('jsonwebtoken');

module.exports.generateToken = (payload, opt = {}) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, opt);
};

module.exports.verifyToken = (token) => {
  try {
    const decode = jwt.verify(token, process.env.TOKEN_SECRET);
    return decode;
  } catch(e) {
    const verifyFailed = new Error('Token invalid');
    verifyFailed.code = 403;
    throw verifyFailed
  }
  
};
