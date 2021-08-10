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
} = genPathData('Checklist');

const summaryObject = {
  summary: 'Checklist APIs',
  description: 'CRUD APIs to interact with Checklist Database',
};

module.exports = {
  // Retrieve data
  '/list': {
    ...summaryObject,
    get: {
      tags: [tags.checklist],
      summary: 'Get list of checklist',
      responses: genDefaultRes('array'),
    },
  },
  '/txhash/{txHash}': {
    ...summaryObject,
    get: {
      tags: [tags.checklist],
      summary: 'Get detail of checklist by Tx Hash',
      parameters: [genParameterItem('txHash', genVarchar(), 'Tx Hash')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Checklist is not found !'),
      },
    },
  },
  '/{id}/is-deleted': {
    ...summaryObject,
    get: {
      tags: [tags.checklist],
      summary: 'Check checklist is deleted or not',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Checklist ID')],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'Checklist is not found !'),
      },
    },
  },
  '/{id}/txhash': {
    ...summaryObject,
    get: {
      tags: [tags.checklist],
      summary: 'Get Tx Hash value by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Checklist ID')],
      responses: {
        ...txhashResponse,
        404: genFailRes(404, 'Checklist is not found !'),
      },
    },
  },
  '/{id}/task-id': {
    ...summaryObject,
    get: {
      tags: [tags.checklist],
      summary: 'Get Task ID value by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Checklist ID')],
      responses: {
        ...foreignKey,
        404: genFailRes(404, 'Checklist is not found !'),
      },
    },
  },
  '/{id}': {
    ...summaryObject,
    get: {
      tags: [tags.checklist],
      summary: 'Get detail of checklist',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Checklist ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Checklist is not found !'),
      },
    },
    put: {
      tags: [tags.checklist],
      summary: 'Update checklist by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Checklist ID')],
      requestBody: genRequestBody(UPDATE_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes,
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Checklist is not found !'),
      },
    },
    delete: {
      tags: [tags.checklist],
      summary: 'Delete checklist by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Checklist ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Checklist is not found !'),
      },
    },
  },
  // Create new data
  '/': {
    ...summaryObject,
    post: {
      tags: [tags.checklist],
      summary: 'Create new checklist',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
};
