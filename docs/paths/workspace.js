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
  getCustomSchemaRef,
} = genPathData('Workspace');

const summaryObject = {
  summary: 'Workspace APIs',
  description: 'CRUD APIs to interact with Workspace Database',
};

const wsTag = [tags.workspace];

module.exports = {
  // Retrieve data
  '/resend-invite-email/{wsId}': {
    ...summaryObject,
    post: genAuthRequest(wsTag, 'Resend invite email', {
      parameters: [genParameterItem('wsId', ID_SCHEMA, 'Workspace ID')],
      requestBody: genRequestBody(
        getCustomSchemaRef('ResendMailRequest'),
        true
      ),
      responses: {
        ...statusResponse,
        400: genFailRes(400, 'Request is invalid !'),
      },
    }),
  },
  '/invite-users/{wsId}': {
    ...summaryObject,
    post: genAuthRequest(wsTag, 'Invite users', {
      parameters: [genParameterItem('wsId', ID_SCHEMA, 'Workspace ID')],
      requestBody: genRequestBody(getCustomSchemaRef('InviteUser'), true),
      responses: {
        ...statusResponse,
        400: genFailRes(400, 'Request is invalid !'),
      },
    }),
  },
  '/accept-invitation': {
    ...summaryObject,
    get: genAuthRequest(wsTag, 'Accept the invitation', {
      parameters: [
        genParameterItem('token', genVarchar(), 'Token', true, 'query'),
      ],
      responses: {
        ...statusResponse,
        400: genFailRes(400, 'Request is invalid !'),
      },
    }),
  },
  '/list-detail': {
    ...summaryObject,
    get: genAuthRequest(
      wsTag,
      'Get list of workspace with project and folder informations',
      {
        responses: genDefaultRes('array'),
      }
    ),
  },
  '/list': {
    ...summaryObject,
    get: genAuthRequest(wsTag, 'Get list of workspace', {
      responses: genDefaultRes('array'),
    }),
  },
  '/txhash/{txHash}': {
    ...summaryObject,
    get: genAuthRequest(wsTag, 'Get detail of workspace by Tx Hash', {
      parameters: [genParameterItem('txHash', genVarchar(), 'Tx Hash')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Workspace is not found !'),
      },
    }),
  },
  '/{id}/is-visible': {
    ...summaryObject,
    get: genAuthRequest(wsTag, 'Check workspace is visible or not', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Workspace ID')],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'Workspace is not found !'),
      },
    }),
  },
  '/{id}/is-deleted': {
    ...summaryObject,
    get: genAuthRequest(wsTag, 'Check workspace is deleted or not', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Workspace ID')],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'Workspace is not found !'),
      },
    }),
  },
  '/{id}/txhash': {
    ...summaryObject,
    get: genAuthRequest(wsTag, 'Get Tx Hash value by id', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Workspace ID')],
      responses: {
        ...txhashResponse,
        404: genFailRes(404, 'Workspace is not found !'),
      },
    }),
  },
  '/{id}': {
    ...summaryObject,
    get: genAuthRequest(wsTag, 'Get detail of workspace', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Workspace ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Workspace is not found !'),
      },
    }),
    put: genAuthRequest(wsTag, 'Update workspace by id', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Workspace ID')],
      requestBody: genRequestBody(UPDATE_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes,
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Workspace is not found !'),
      },
    }),
    delete: genAuthRequest(wsTag, 'Delete workspace by id', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Workspace ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Workspace is not found !'),
      },
    }),
  },
  // Create new data
  '/': {
    ...summaryObject,
    post: genAuthRequest(wsTag, 'Create new workspace', {
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    }),
  },
  // Update exited data
  '/{id}/switch-visible': {
    ...summaryObject,
    put: genAuthRequest(wsTag, 'Switch the value of visible field by id', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Workspace ID')],
      responses: {
        ...genDefaultRes,
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Workspace is not found !'),
      },
    }),
  },
};
