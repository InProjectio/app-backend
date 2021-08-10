const { check } = require('express-validator');

module.exports.signUpValidate = () => [
  check('email', 'Email is required').not().isEmpty(),
  check('email', 'Email is invalid !').isEmail(),
  check('username', 'Username is required !').not().isEmpty(),
  check('password', 'Password is required !').not().isEmpty(),
];
