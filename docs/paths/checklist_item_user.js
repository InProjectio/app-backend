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
} = genPathData('ChecklistItemUser');

const summaryObject = {
  summary: 'ChecklistItemUser APIs',
  description: 'CRUD APIs to interact with ChecklistItemUser Database',
};

module.exports = {
  // Retrieve data
  '/list': {
    ...summaryObject,
    get: {
      tags: [tags.clItemUser],
      summary: 'Get list of checklist item user',
      responses: genDefaultRes('array'),
    },
  },
  '/txhash/{txHash}': {
    ...summaryObject,
    get: {
      tags: [tags.clItemUser],
      summary: 'Get detail of checklist item user by Tx Hash',
      parameters: [genParameterItem('txHash', genVarchar(), 'Tx Hash')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'ChecklistItemUser is not found !'),
      },
    },
  },
  '/{id}/is-assigner': {
    ...summaryObject,
    get: {
      tags: [tags.clItemUser],
      summary: 'Check the value of assigner is true or not',
      parameters: [genParameterItem('id', ID_SCHEMA, 'ChecklistItemUser ID')],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'ChecklistItemUser is not found !'),
      },
    },
  },
  '/{id}/is-assignee': {
    ...summaryObject,
    get: {
      tags: [tags.clItemUser],
      summary: 'Check the value of assignee is true or not',
      parameters: [genParameterItem('id', ID_SCHEMA, 'ChecklistItemUser ID')],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'ChecklistItemUser is not found !'),
      },
    },
  },
  '/{id}/txhash': {
    ...summaryObject,
    get: {
      tags: [tags.clItemUser],
      summary: 'Get Tx Hash value by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'ChecklistItemUser ID')],
      responses: {
        ...txhashResponse,
        404: genFailRes(404, 'ChecklistItemUser is not found !'),
      },
    },
  },
  '/{id}': {
    ...summaryObject,
    get: {
      tags: [tags.clItemUser],
      summary: 'Get detail of checklist item user',
      parameters: [genParameterItem('id', ID_SCHEMA, 'ChecklistItemUser ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'ChecklistItemUser is not found !'),
      },
    },
    put: {
      tags: [tags.clItemUser],
      summary: 'Update checklist item user by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'ChecklistItemUser ID')],
      requestBody: genRequestBody(UPDATE_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes,
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'ChecklistItemUser is not found !'),
      },
    },
    delete: {
      tags: [tags.clItemUser],
      summary: 'Delete checklist item user by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'ChecklistItemUser ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'ChecklistItemUser is not found !'),
      },
    },
  },
  // Create new data
  '/': {
    ...summaryObject,
    post: {
      tags: [tags.clItemUser],
      summary: 'Create new checklist item user',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
};
