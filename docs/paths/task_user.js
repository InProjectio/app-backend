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
} = genPathData('TaskUser');

const summaryObject = {
  summary: 'TaskUser APIs',
  description: 'CRUD APIs to interact with TaskUser Database',
};

module.exports = {
  // Retrieve data
  '/list': {
    ...summaryObject,
    get: {
      tags: [tags.taskUser],
      summary: 'Get list of task_user',
      responses: genDefaultRes('array'),
    },
  },
  '/txhash/{txHash}': {
    ...summaryObject,
    get: {
      tags: [tags.taskUser],
      summary: 'Get detail of task_user by Tx Hash',
      parameters: [genParameterItem('txHash', genVarchar(), 'Tx Hash')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'TaskUser is not found !'),
      },
    },
  },
  '/{taskId}/{userId}/is-assignee': {
    ...summaryObject,
    get: {
      tags: [tags.taskUser],
      summary: 'Check whether is assignee or not',
      parameters: [
        genParameterItem('taskId', ID_SCHEMA, 'Task ID'),
        genParameterItem('userId', ID_SCHEMA, 'User ID'),
      ],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'TaskUser is not found !'),
      },
    },
  },
  '/{taskId}/{userId}/is-owner': {
    ...summaryObject,
    get: {
      tags: [tags.taskUser],
      summary: 'Check whether is owner or not',
      parameters: [
        genParameterItem('taskId', ID_SCHEMA, 'Task ID'),
        genParameterItem('userId', ID_SCHEMA, 'User ID'),
      ],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'TaskUser is not found !'),
      },
    },
  },
  '/{taskId}/{userId}/is-watch': {
    ...summaryObject,
    get: {
      tags: [tags.taskUser],
      summary: 'Check whether is watched or not',
      parameters: [
        genParameterItem('taskId', ID_SCHEMA, 'Task ID'),
        genParameterItem('userId', ID_SCHEMA, 'User ID'),
      ],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'TaskUser is not found !'),
      },
    },
  },
  '/{taskId}/{userId}': {
    ...summaryObject,
    get: {
      tags: [tags.taskUser],
      summary: 'Get detail of task_user',
      parameters: [
        genParameterItem('taskId', ID_SCHEMA, 'Task ID'),
        genParameterItem('userId', ID_SCHEMA, 'User ID'),
      ],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'TaskUser is not found !'),
      },
    },
    put: {
      tags: [tags.taskUser],
      summary: 'Update task_user by id',
      parameters: [
        genParameterItem('taskId', ID_SCHEMA, 'Task ID'),
        genParameterItem('userId', ID_SCHEMA, 'User ID'),
      ],
      requestBody: genRequestBody(UPDATE_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes,
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'TaskUser is not found !'),
      },
    },
    delete: {
      tags: [tags.taskUser],
      summary: 'Delete task_user by id',
      parameters: [
        genParameterItem('taskId', ID_SCHEMA, 'Task ID'),
        genParameterItem('userId', ID_SCHEMA, 'User ID'),
      ],

      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'TaskUser is not found !'),
      },
    },
  },
  // Create new data
  '/': {
    ...summaryObject,
    post: {
      tags: [tags.taskUser],
      summary: 'Create new task_user',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
};
