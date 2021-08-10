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
  genCustomResFromCustomRef,
  getCustomSchemaRef,
} = genPathData('User');

const summaryObject = {
  summary: 'User APIs',
  description: 'CRUD APIs to interact with User Database',
};

const userTag = [tags.user];

module.exports = {
  '/friends': {
    ...summaryObject,
    get: genAuthRequest(userTag, 'Get friend list of the user', {
      responses: genDefaultRes('array'),
    }),
  },
  '/users-in-project/{pjId}': {
    ...summaryObject,
    get: genAuthRequest(
      userTag,
      'Get list of user from project_id with accept status',
      {
        responses: genDefaultRes('array'),
      },
      {
        parameters: [genParameterItem('pjId', ID_SCHEMA, 'Project ID')],
        responses: genCustomResFromCustomRef(
          getCustomSchemaRef('WithAcceptStatus'),
          'array'
        ),
      }
    ),
  },
  '/users-in-workspace/{wsId}': {
    ...summaryObject,
    get: genAuthRequest(
      userTag,
      'Get list of user from workspace_id with accept status',
      {
        parameters: [genParameterItem('wsId', ID_SCHEMA, 'Workspace ID')],
        responses: genCustomResFromCustomRef(
          getCustomSchemaRef('WithAcceptStatus'),
          'array'
        ),
      }
    ),
  },
  // Create new data
  '/sign-up': {
    ...summaryObject,
    post: genNonAuthRequest(userTag, 'Create new user', {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                email: {
                  type: 'string',
                  required: true,
                },
                username: {
                  type: 'string',
                  required: true,
                },
                password: {
                  type: 'string',
                  required: true,
                },
              },
            },
          },
        },
      },
      responses: {
        ...statusResponse,
        400: genFailRes(400, 'Request is invalid !'),
      },
    }),
  },
  '/active-user': {
    ...summaryObject,
    get: genNonAuthRequest(userTag, 'Active the user', {
      parameters: [
        genParameterItem(
          'username',
          { type: 'string' },
          'Username',
          true,
          'query'
        ),
        genParameterItem(
          'email',
          { type: 'string' },
          'Email Address',
          true,
          'query'
        ),
        genParameterItem(
          'otp_code',
          { type: 'string' },
          'OTP Code',
          true,
          'query'
        ),
      ],
      responses: {
        ...statusResponse,
        400: genFailRes(400, 'Request is invalid !'),
      },
    }),
  },
  '/sign-in': {
    ...summaryObject,
    post: genNonAuthRequest(userTag, 'Active the user', {
      requestBody: {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                username: {
                  type: 'string',
                  required: true,
                },
                password: {
                  type: 'string',
                  required: true,
                },
              },
            },
          },
        },
      },
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    }),
  },
};
