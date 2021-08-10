const bcrypt = require('bcrypt');

const saltRounds = process.env.PASS_SALT_ROUND || 10;

const hashPassword = (rawPass) => bcrypt.hashSync(rawPass, saltRounds);

const comparePassword = (rawPass, hashPass) =>
  bcrypt.compareSync(rawPass, hashPass);

module.exports = {
  hashPassword,
  comparePassword,
};
