const tags = require('../tags');
const {
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
} = require('../helpers');

const { ID_SCHEMA, NEW_INPUT_SCHEMA, genDefaultRes } = genPathData('Timeline');

module.exports = {
  '/timeline': {
    summary: 'Timeline APIs',
    description: 'CRUD APIs to interact with Timeline Database',
    post: {
      tags: [tags.timeline],
      summary: 'Create new timeline',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
  '/timeline/list': {
    summary: 'Timeline APIs',
    description: 'CRUD APIs to interact with Timeline Database',
    get: {
      tags: [tags.timeline],
      summary: 'Get list of timeline',
      responses: genDefaultRes('array'),
    },
  },
  '/timeline/{id}': {
    summary: 'Timeline APIs',
    description: 'CRUD APIs to interact with Timeline Database',
    get: {
      tags: [tags.timeline],
      summary: 'Get detail of timeline',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Timeline ID')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Timeline is not found !'),
      },
    },
    put: {
      tags: [tags.timeline],
      summary: 'Update timeline by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Timeline ID')],
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Timeline is not found !'),
      },
    },
    delete: {
      tags: [tags.timeline],
      summary: 'Delete timeline by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Timeline ID')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Timeline is not found !'),
      },
    },
  },
};
