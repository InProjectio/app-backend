const { validationResult } = require('express-validator');

module.exports.withValidation = (handlerFunc) => async (req, res, next) => {
  try {
    const errors = validationResult(req);
    console.log('withValidation ===> ', errors)
    if (errors.isEmpty() === false) {
      const { msg } = errors.array()[0];
      const invalidRequestDataError = new Error(msg);
      invalidRequestDataError.code = 400;
      throw invalidRequestDataError;
    }
    await handlerFunc(req, res, next);
  } catch (error) {
    next(error);
  }
};
