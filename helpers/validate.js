const { checkSchema } = require('express-validator');

module.exports.validateSchema = (schema) => async (req, res, next) => {
  const [] = checkSchema(schema);
};
