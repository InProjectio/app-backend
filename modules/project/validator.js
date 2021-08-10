const { check } = require('express-validator');

module.exports.resendMailSchema = () => [
  check('emails', 'Emails is required').isArray(),
  check('emails.*', 'Email is invalid').isEmail(),
];
