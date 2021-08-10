const tags = require('../tags');
const {
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
  genVarchar,
  genAuthRequest,
  genNonAuthRequest,
} = require('../helpers');

const {
  ID_SCHEMA,
  NEW_INPUT_SCHEMA,
  UPDATE_INPUT_SCHEMA,
  genDefaultRes,
  statusResponse,
  txhashResponse,
  foreignKey,
  getCustomSchemaRef,
  genCustomResFromCustomRef,
} = genPathData('Project');

const summaryObject = {
  summary: 'Project APIs',
  description: 'CRUD APIs to interact with Project Database',
};

const pjTag = [tags.project];

module.exports = {
  // Retrieve data
  '/resend-invite-email/{pjId}': {
    ...summaryObject,
    post: genAuthRequest(pjTag, 'Resend invite email', {
      parameters: [genParameterItem('pjId', ID_SCHEMA, 'Project ID')],
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
  '/invite-users/{pjId}': {
    ...summaryObject,
    post: genAuthRequest(pjTag, 'Invite users', {
      parameters: [genParameterItem('pjId', ID_SCHEMA, 'Project ID')],
      requestBody: genRequestBody(getCustomSchemaRef('InviteUser'), true),
      responses: {
        ...statusResponse,
        400: genFailRes(400, 'Request is invalid !'),
      },
    }),
  },
  '/accept-invitation': {
    ...summaryObject,
    get: genNonAuthRequest(pjTag, 'Accept the invitation', {
      parameters: [
        genParameterItem('token', genVarchar(), 'Token', true, 'query'),
      ],
      responses: {
        ...statusResponse,
        400: genFailRes(400, 'Request is invalid !'),
      },
    }),
  },
  '/list': {
    ...summaryObject,
    get: genAuthRequest(pjTag, 'Get list of project', {
      responses: genDefaultRes('array'),
    }),
  },
  '/txhash/{txHash}': {
    ...summaryObject,
    get: genAuthRequest(pjTag, 'Get detail of project by Tx Hash', {
      parameters: [genParameterItem('txHash', genVarchar(), 'Tx Hash')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Project is not found !'),
      },
    }),
  },
  '/{id}/is-visible': {
    ...summaryObject,
    get: genAuthRequest(pjTag, 'Check project is visible or not', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Project ID')],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'Project is not found !'),
      },
    }),
  },
  '/{id}/is-deleted': {
    ...summaryObject,
    get: genAuthRequest(pjTag, 'Check project is deleted or not', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Project ID')],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'Project is not found !'),
      },
    }),
  },
  '/{id}/txhash': {
    ...summaryObject,
    get: genAuthRequest(pjTag, 'Get Tx Hash value by id', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Project ID')],
      responses: {
        ...txhashResponse,
        404: genFailRes(404, 'Project is not found !'),
      },
    }),
  },
  '/{id}/workspace-id': {
    ...summaryObject,
    get: genAuthRequest(pjTag, 'Get Workspace ID value by id', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Project ID')],
      responses: {
        ...foreignKey,
        404: genFailRes(404, 'Project is not found !'),
      },
    }),
  },
  '/{id}': {
    ...summaryObject,
    get: genAuthRequest(pjTag, 'Get detail of project', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Project ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Project is not found !'),
      },
    }),
    put: genAuthRequest(pjTag, 'Update project by id', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Project ID')],
      requestBody: genRequestBody(UPDATE_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes,
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Project is not found !'),
      },
    }),
    delete: genAuthRequest(pjTag, 'Delete project by id', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Project ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Project is not found !'),
      },
    }),
  },
  // Create new data

  '/': {
    ...summaryObject,
    post: genAuthRequest(pjTag, 'Create new project', {
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
    put: genAuthRequest(pjTag, 'Switch the value of visible field by id', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Project ID')],
      responses: {
        ...genDefaultRes,
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Project is not found !'),
      },
    }),
  },
};
