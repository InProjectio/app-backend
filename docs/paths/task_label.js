const tags = require('../tags');
const {
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
} = require('../helpers');

const { ID_SCHEMA, NEW_INPUT_SCHEMA, genDefaultRes } = genPathData('TaskLabel');

module.exports = {
  '/': {
    summary: 'Task Label APIs',
    description: 'CRUD APIs to interact with Task Label Database',
    post: {
      tags: [tags.taskLabel],
      summary: 'Create new task label',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
  '/list': {
    summary: 'Task Label APIs',
    description: 'CRUD APIs to interact with Task Label Database',
    get: {
      tags: [tags.taskLabel],
      summary: 'Get list of task label',
      responses: genDefaultRes('array'),
    },
  },
  '/{id}': {
    summary: 'Task Label APIs',
    description: 'CRUD APIs to interact with Task Label Database',
    get: {
      tags: [tags.taskLabel],
      summary: 'Get detail of task label',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Task Label ID')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Task Label is not found !'),
      },
    },
    put: {
      tags: [tags.taskLabel],
      summary: 'Update task label by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Task Label ID')],
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Task Label is not found !'),
      },
    },
    delete: {
      tags: [tags.taskLabel],
      summary: 'Delete task label by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Task Label ID')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Task Label is not found !'),
      },
    },
  },
};
