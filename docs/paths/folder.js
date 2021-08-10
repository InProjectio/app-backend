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
} = genPathData('Folder');

const summaryObject = {
  summary: 'Folder APIs',
  description: 'CRUD APIs to interact with Folder Database',
};

module.exports = {
  // Retrieve data
  '/list': {
    ...summaryObject,
    get: {
      tags: [tags.folder],
      summary: 'Get list of folder',
      responses: genDefaultRes('array'),
    },
  },
  '/txhash/{txHash}': {
    ...summaryObject,
    get: {
      tags: [tags.folder],
      summary: 'Get detail of folder by Tx Hash',
      parameters: [genParameterItem('txHash', genVarchar(), 'Tx Hash')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Folder is not found !'),
      },
    },
  },
  '/{id}/is-deleted': {
    ...summaryObject,
    get: {
      tags: [tags.folder],
      summary: 'Check folder is deleted or not',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Folder ID')],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'Folder is not found !'),
      },
    },
  },
  '/{id}/is-visible': {
    ...summaryObject,
    get: {
      tags: [tags.folder],
      summary: 'Check folder is visible or not',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Folder ID')],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'Folder is not found !'),
      },
    },
  },
  '/{id}/txhash': {
    ...summaryObject,
    get: {
      tags: [tags.folder],
      summary: 'Get Tx Hash value by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Folder ID')],
      responses: {
        ...txhashResponse,
        404: genFailRes(404, 'Folder is not found !'),
      },
    },
  },
  '/{id}/project-id': {
    ...summaryObject,
    get: {
      tags: [tags.folder],
      summary: 'Get Project ID value by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Folder ID')],
      responses: {
        ...foreignKey,
        404: genFailRes(404, 'Folder is not found !'),
      },
    },
  },
  '/{id}': {
    ...summaryObject,
    get: {
      tags: [tags.folder],
      summary: 'Get detail of folder',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Folder ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Folder is not found !'),
      },
    },
    put: {
      tags: [tags.folder],
      summary: 'Update folder by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Folder ID')],
      requestBody: genRequestBody(UPDATE_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes,
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Folder is not found !'),
      },
    },
    delete: {
      tags: [tags.folder],
      summary: 'Delete folder by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Folder ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Folder is not found !'),
      },
    },
  },
  // Create new data
  '/': {
    ...summaryObject,
    post: {
      tags: [tags.folder],
      summary: 'Create new folder',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
};
