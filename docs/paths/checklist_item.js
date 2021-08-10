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
} = genPathData('ChecklistItem');

const summaryObject = {
  summary: 'ChecklistItem APIs',
  description: 'CRUD APIs to interact with ChecklistItem Database',
};

module.exports = {
  // Retrieve data
  '/list': {
    ...summaryObject,
    get: {
      tags: [tags.clItem],
      summary: 'Get list of checklist item',
      responses: genDefaultRes('array'),
    },
  },
  '/txhash/{txHash}': {
    ...summaryObject,
    get: {
      tags: [tags.clItem],
      summary: 'Get detail of checklist item by Tx Hash',
      parameters: [genParameterItem('txHash', genVarchar(), 'Tx Hash')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'ChecklistItem is not found !'),
      },
    },
  },
  '/{id}/is-deleted': {
    ...summaryObject,
    get: {
      tags: [tags.clItem],
      summary: 'Check checklist item is deleted or not',
      parameters: [genParameterItem('id', ID_SCHEMA, 'ChecklistItem ID')],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'ChecklistItem is not found !'),
      },
    },
  },
  '/{id}/txhash': {
    ...summaryObject,
    get: {
      tags: [tags.clItem],
      summary: 'Get Tx Hash value by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'ChecklistItem ID')],
      responses: {
        ...txhashResponse,
        404: genFailRes(404, 'ChecklistItem is not found !'),
      },
    },
  },
  '/{id}/checklist-id': {
    ...summaryObject,
    get: {
      tags: [tags.clItem],
      summary: 'Get Checklist ID value by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'ChecklistItem ID')],
      responses: {
        ...foreignKey,
        404: genFailRes(404, 'ChecklistItem is not found !'),
      },
    },
  },
  '/{id}': {
    ...summaryObject,
    get: {
      tags: [tags.clItem],
      summary: 'Get detail of checklist item',
      parameters: [genParameterItem('id', ID_SCHEMA, 'ChecklistItem ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'ChecklistItem is not found !'),
      },
    },
    put: {
      tags: [tags.clItem],
      summary: 'Update checklist item by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'ChecklistItem ID')],
      requestBody: genRequestBody(UPDATE_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes,
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'ChecklistItem is not found !'),
      },
    },
    delete: {
      tags: [tags.clItem],
      summary: 'Delete checklist item by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'ChecklistItem ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'ChecklistItem is not found !'),
      },
    },
  },
  // Create new data
  '/': {
    ...summaryObject,
    post: {
      tags: [tags.clItem],
      summary: 'Create new checklist item',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
};
