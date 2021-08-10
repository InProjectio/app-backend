const { mongoErrorCode } = require('../configs/error_code');

const getErrorCode = (code) => {
  if (code > 511) {
    if (mongoErrorCode[`${code}`]) {
      return mongoErrorCode[`${code}`];
    }
  } else {
    return code;
  }
};

const successResponse = (res, data) => {
  return res.status(200).json({
    data,
  });
};

const failResponse = (res, code, error) => {
  const response = {
    code,
    message: error.message,
  };
  if (process.env.STAGE === 'localhost') {
    response.stack = error.stack;
  }
  return res.status(code).json(response);
};

const urlNotFoundHandler = (req, res, next) => {
  const error = new Error(`${req.originalUrl} is not found !`);
  return failResponse(res, 404, error);
};

const requestHandler = (data, req, res, next) => {
  if (typeof data !== 'undefined' && data) {
    if (data instanceof Error) {
      console.error(data);
      const code = getErrorCode(data.code) || 500;
      return failResponse(res, code, data);
    }
    if (typeof data === 'string' && ['true', 'false'].includes(data)) {
      const booleanData = data === 'true' ? true : false;
      return successResponse(res, booleanData);
    } else if (
      typeof data === 'string' &&
      ['undefined', 'null'].includes(data)
    ) {
      const nullData = null;
      return successResponse(res, nullData);
    }
    return successResponse(res, data);
  }
  next();
};

module.exports = {
  successResponse,
  failResponse,
  urlNotFoundHandler,
  requestHandler,
};
