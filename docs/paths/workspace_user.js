const tags = require('../tags');
const {
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
  genVarchar,
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
} = genPathData('WorkspaceUser');

const summaryObject = {
  summary: 'WorkspaceUser APIs',
  description: 'CRUD APIs to interact with WorkspaceUser Database',
};

const WSTag = [tags.wsUser];

module.exports = {
  // Retrieve data
  '/txhash/{txHash}': {
    ...summaryObject,
    get: genAuthRequest(WSTag, 'Get detail of workspace_user by Tx Hash', {
      parameters: [genParameterItem('txHash', genVarchar(), 'Tx Hash')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'WorkspaceUser is not found !'),
      },
    }),
  },
  '/{wsId}/{userId}/role': {
    ...summaryObject,
    get: genAuthRequest(WSTag, 'Get role value', {
      parameters: [
        genParameterItem('wsId', ID_SCHEMA, 'Task ID'),
        genParameterItem('userId', ID_SCHEMA, 'User ID'),
      ],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'WorkspaceUser is not found !'),
      },
    }),
  },
  '/{wsId}/{userId}/is-owner': {
    ...summaryObject,
    get: genAuthRequest(WSTag, 'Check whether is owner or not', {
      parameters: [
        genParameterItem('wsId', ID_SCHEMA, 'Task ID'),
        genParameterItem('userId', ID_SCHEMA, 'User ID'),
      ],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'WorkspaceUser is not found !'),
      },
    }),
  },
  '/user-list/{wsId}': {
    ...summaryObject,
    get: genAuthRequest(WSTag, 'Get list of user by workspace id', {
      parameters: [genParameterItem('wsId', ID_SCHEMA, 'Workspace ID')],
      responses: genCustomRes('User', 'array'),
    }),
  },
  '/workspace-list/{userId}': {
    ...summaryObject,
    get: genAuthRequest(WSTag, 'Get list of workspace by user id', {
      parameters: [genParameterItem('userId', ID_SCHEMA, 'User ID')],
      responses: genCustomRes('Workspace', 'array'),
    }),
  },
  '/{wsId}/{userId}': {
    ...summaryObject,
    get: genAuthRequest(WSTag, 'Get detail of workspace_user', {
      parameters: [
        genParameterItem('wsId', ID_SCHEMA, 'Task ID'),
        genParameterItem('userId', ID_SCHEMA, 'User ID'),
      ],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'WorkspaceUser is not found !'),
      },
    }),
    put: genAuthRequest(WSTag, 'Update workspace_user by id', {
      parameters: [
        genParameterItem('wsId', ID_SCHEMA, 'Task ID'),
        genParameterItem('userId', ID_SCHEMA, 'User ID'),
      ],
      requestBody: genRequestBody(UPDATE_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes,
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'WorkspaceUser is not found !'),
      },
    }),
    delete: genAuthRequest(WSTag, 'Delete workspace_user by id', {
      parameters: [
        genParameterItem('wsId', ID_SCHEMA, 'Task ID'),
        genParameterItem('userId', ID_SCHEMA, 'User ID'),
      ],

      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'WorkspaceUser is not found !'),
      },
    }),
  },
  // Create new data
  '/': {
    ...summaryObject,
    post: genAuthRequest(WSTag, 'Create new workspace_user', {
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    }),
  },
};
