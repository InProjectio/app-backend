const tags = require('../tags');
const {
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
  genVarchar,
} = require('../helpers');

const {
  ID_SCHEMA,
  NEW_INPUT_SCHEMA,
  UPDATE_INPUT_SCHEMA,
  genDefaultRes,
  statusResponse,
  txhashResponse,
  foreignKey,
} = genPathData('Log');

const summaryObject = {
  summary: 'Log APIs',
  description: 'CRUD APIs to interact with Log Database',
};

module.exports = {
  // Retrieve data
  '/list': {
    ...summaryObject,
    get: {
      tags: [tags.log],
      summary: 'Get list of log',
      responses: genDefaultRes('array'),
    },
  },
  '/list/{userId}': {
    ...summaryObject,
    get: {
      tags: [tags.log],
      parameters: [genParameterItem('userId', ID_SCHEMA, 'User ID')],
      summary: 'Get list of log by User ID',
      responses: genDefaultRes('array'),
    },
  },
  '/{id}': {
    ...summaryObject,
    get: {
      tags: [tags.log],
      summary: 'Get detail of log',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Log ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Log is not found !'),
      },
    },
  },
  // Create new data
  '/': {
    ...summaryObject,
    post: {
      tags: [tags.log],
      summary: 'Create new log',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
};
