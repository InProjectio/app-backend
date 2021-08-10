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
} = genPathData('Activity');

const summaryObject = {
  summary: 'Activity APIs',
  description: 'CRUD APIs to interact with Activity Database',
};

module.exports = {
  // Retrieve data
  '/list': {
    ...summaryObject,
    get: {
      tags: [tags.activity],
      summary: 'Get list of activity',
      responses: genDefaultRes('array'),
    },
  },
  '/txhash/{txHash}': {
    ...summaryObject,
    get: {
      tags: [tags.activity],
      summary: 'Get detail of activity by Tx Hash',
      parameters: [genParameterItem('txHash', genVarchar(), 'Tx Hash')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Activity is not found !'),
      },
    },
  },
  '/{id}/is-deleted': {
    ...summaryObject,
    get: {
      tags: [tags.activity],
      summary: 'Check activity is deleted or not',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Activity ID')],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'Activity is not found !'),
      },
    },
  },
  '/{id}/txhash': {
    ...summaryObject,
    get: {
      tags: [tags.activity],
      summary: 'Get Tx Hash value by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Activity ID')],
      responses: {
        ...txhashResponse,
        404: genFailRes(404, 'Activity is not found !'),
      },
    },
  },
  '/{id}/task-id': {
    ...summaryObject,
    get: {
      tags: [tags.activity],
      summary: 'Get Task ID value by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Activity ID')],
      responses: {
        ...foreignKey,
        404: genFailRes(404, 'Activity is not found !'),
      },
    },
  },
  '/{id}': {
    ...summaryObject,
    get: {
      tags: [tags.activity],
      summary: 'Get detail of activity',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Activity ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Activity is not found !'),
      },
    },
    put: {
      tags: [tags.activity],
      summary: 'Update activity by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Activity ID')],
      requestBody: genRequestBody(UPDATE_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes,
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Activity is not found !'),
      },
    },
    delete: {
      tags: [tags.activity],
      summary: 'Delete activity by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Activity ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Activity is not found !'),
      },
    },
  },
  // Create new data
  '/': {
    ...summaryObject,
    post: {
      tags: [tags.activity],
      summary: 'Create new activity',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
};
