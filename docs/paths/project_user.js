const tags = require('../tags');
const {
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
  genVarchar,
  genKey,
  genAuthRequest,
} = require('../helpers');

const {
  ID_SCHEMA,
  NEW_INPUT_SCHEMA,
  UPDATE_INPUT_SCHEMA,
  genDefaultRes,
  statusResponse,
  txhashResponse,
  foreignKey,
  genCustomRes,
} = genPathData('ProjectUser');

const summaryObject = {
  summary: 'Project User APIs',
  description: 'CRUD APIs to interact with Project User Database',
};

const PJTag = [tags.pjUser];

module.exports = {
  // Retrieve data
  '/list': {
    ...summaryObject,
    get: genAuthRequest(PJTag, 'Get list of project user', {
      responses: genDefaultRes('array'),
    }),
  },
  '/user-list/{projectId}': {
    ...summaryObject,
    get: genAuthRequest(PJTag, 'Get list of user from Project ID', {
      parameters: [genParameterItem('projectId', ID_SCHEMA, 'Project ID')],
      responses: genCustomRes('User', 'array'),
    }),
  },
  '/project-list/{userId}': {
    ...summaryObject,
    get: genAuthRequest(PJTag, 'Get list of project from User ID', {
      parameters: [
        genParameterItem('userId', ID_SCHEMA, 'User ID'),
        genParameterItem('workspace_id', genKey(), 'User ID', false, 'query'),
      ],
      responses: genCustomRes('Project', 'array'),
    }),
  },
  '/role/{projectId}/{userId}': {
    ...summaryObject,
    get: genAuthRequest(PJTag, 'Get role of the record', {
      parameters: [
        genParameterItem('projectId', genKey(), 'Project ID'),
        genParameterItem('userId', genKey(), 'User ID'),
      ],
      responses: { ...txhashResponse },
    }),
  },
  '/is-owner/{projectId}/{userId}': {
    ...summaryObject,
    get: genAuthRequest(PJTag, 'Check whether is owner or not', {
      parameters: [
        genParameterItem('projectId', genKey(), 'Project ID'),
        genParameterItem('userId', genKey(), 'User ID'),
      ],
      responses: { ...statusResponse },
    }),
  },
  '/txhash/{txHash}': {
    ...summaryObject,
    get: genAuthRequest(PJTag, 'Get detail by txhash', {
      parameters: [genParameterItem('txHash', genVarchar(), 'Tx Hash')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Project User is not found !'),
      },
    }),
  },
  '/{projectId}/{userId}': {
    ...summaryObject,
    get: genAuthRequest(PJTag, 'Get detail by Project Id and User Id', {
      parameters: [
        genParameterItem('projectId', genKey(), 'Project Id'),
        genParameterItem('userId', genKey(), 'User Id'),
      ],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Project User is not found !'),
      },
    }),
    put: genAuthRequest(PJTag, 'Update record by Project Id and User Id', {
      parameters: [
        genParameterItem('projectId', genKey(), 'Project Id'),
        genParameterItem('userId', genKey(), 'User Id'),
      ],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Project User is not found !'),
      },
    }),
    delete: genAuthRequest(
      PJTag,
      'Delete one record by Project Id and User Id',
      {
        parameters: [
          genParameterItem('projectId', genKey(), 'Project Id'),
          genParameterItem('userId', genKey(), 'User Id'),
        ],
        responses: {
          ...genDefaultRes(),
          404: genFailRes(404, 'Project User is not found !'),
        },
      }
    ),
  },

  // Create new data
  '/': {
    ...summaryObject,
    post: genAuthRequest(PJTag, 'Create new project user', {
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    }),
  },
};
