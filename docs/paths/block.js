const tags = require('../tags');
const {
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
} = require('../helpers');

const { ID_SCHEMA, NEW_INPUT_SCHEMA, genDefaultRes } = genPathData('Block');

module.exports = {
  '/block': {
    summary: 'Block APIs',
    description: 'CRUD APIs to interact with Block Database',
    post: {
      tags: [tags.block],
      summary: 'Create new block',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
  '/block/list': {
    summary: 'Block APIs',
    description: 'CRUD APIs to interact with Block Database',
    get: {
      tags: [tags.block],
      summary: 'Get list of block',
      responses: genDefaultRes('array'),
    },
  },
  '/block/{id}': {
    summary: 'Block APIs',
    description: 'CRUD APIs to interact with Block Database',
    get: {
      tags: [tags.block],
      summary: 'Get detail of block',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Block ID')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Block is not found !'),
      },
    },
    put: {
      tags: [tags.block],
      summary: 'Update block by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Block ID')],
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Block is not found !'),
      },
    },
    delete: {
      tags: [tags.block],
      summary: 'Delete block by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Block ID')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Block is not found !'),
      },
    },
  },
};
