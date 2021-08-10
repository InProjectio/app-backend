const tags = require('../tags');
const {
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
} = require('../helpers');

const { ID_SCHEMA, NEW_INPUT_SCHEMA, genDefaultRes } = genPathData('UserBlock');

module.exports = {
  '/user-block': {
    summary: 'User Block APIs',
    description: 'CRUD APIs to interact with User Block Database',
    post: {
      tags: [tags.userBlock],
      summary: 'Create new user block',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
  '/user-block/list': {
    summary: 'User Block APIs',
    description: 'CRUD APIs to interact with User Block Database',
    get: {
      tags: [tags.userBlock],
      summary: 'Get list of user block',
      responses: genDefaultRes('array'),
    },
  },
  '/user-block/{id}': {
    summary: 'User Block APIs',
    description: 'CRUD APIs to interact with User Block Database',
    get: {
      tags: [tags.userBlock],
      summary: 'Get detail of user block',
      parameters: [genParameterItem('id', ID_SCHEMA, 'User Block ID')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'User Block is not found !'),
      },
    },
    put: {
      tags: [tags.userBlock],
      summary: 'Update user block by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'User Block ID')],
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'User Block is not found !'),
      },
    },
    delete: {
      tags: [tags.userBlock],
      summary: 'Delete user block by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'User Block ID')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'User Block is not found !'),
      },
    },
  },
};
