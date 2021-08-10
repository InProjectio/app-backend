const tags = require('../tags');
const {
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
} = require('../helpers');

const { ID_SCHEMA, NEW_INPUT_SCHEMA, genDefaultRes } =
  genPathData('ActivityUser');

module.exports = {
  '/activity-user': {
    summary: 'Activity User APIs',
    description: 'CRUD APIs to interact with Activity User Database',
    post: {
      tags: [tags.acUser],
      summary: 'Create new activity user',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
  '/activity-user/list': {
    summary: 'Activity User APIs',
    description: 'CRUD APIs to interact with Activity User Database',
    get: {
      tags: [tags.acUser],
      summary: 'Get list of activity user',
      responses: genDefaultRes('array'),
    },
  },
  '/activity-user/{id}': {
    summary: 'Activity User APIs',
    description: 'CRUD APIs to interact with Activity User Database',
    get: {
      tags: [tags.acUser],
      summary: 'Get detail of activity user',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Activity User ID')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Activity User is not found !'),
      },
    },
    put: {
      tags: [tags.acUser],
      summary: 'Update activity user by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Activity User ID')],
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Activity User is not found !'),
      },
    },
    delete: {
      tags: [tags.acUser],
      summary: 'Delete activity user by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Activity User ID')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Activity User is not found !'),
      },
    },
  },
};
