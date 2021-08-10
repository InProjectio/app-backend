const tags = require('../tags');
const {
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
} = require('../helpers');

const { ID_SCHEMA, NEW_INPUT_SCHEMA, genDefaultRes } = genPathData(
  'DependencyDependency Task'
);

module.exports = {
  '/dependency-task': {
    summary: 'Dependency Task APIs',
    description: 'CRUD APIs to interact with Dependency Task Database',
    post: {
      tags: [tags.depTask],
      summary: 'Create new dependency task',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
  '/dependency-task/list': {
    summary: 'Dependency Task APIs',
    description: 'CRUD APIs to interact with Dependency Task Database',
    get: {
      tags: [tags.depTask],
      summary: 'Get list of dependency task',
      responses: genDefaultRes('array'),
    },
  },
  '/dependency-task/{id}': {
    summary: 'Dependency Task APIs',
    description: 'CRUD APIs to interact with Dependency Task Database',
    get: {
      tags: [tags.depTask],
      summary: 'Get detail of dependency task',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Dependency Task ID')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Dependency Task is not found !'),
      },
    },
    put: {
      tags: [tags.depTask],
      summary: 'Update dependency task by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Dependency Task ID')],
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Dependency Task is not found !'),
      },
    },
    delete: {
      tags: [tags.depTask],
      summary: 'Delete dependency task by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Dependency Task ID')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Dependency Task is not found !'),
      },
    },
  },
};
