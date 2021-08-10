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
  genCustomResFromCustomRef,
  getCustomSchemaRef,
} = genPathData('Attachment');

const summaryObject = {
  summary: 'Attachment APIs',
  description: 'CRUD APIs to interact with Attachment Database',
};

const attachmentTag = [tags.attachment];

module.exports = {
  // Retrieve data
  '/upload': {
    ...summaryObject,
    post: genAuthRequest(attachmentTag, 'Upload attachments', {
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                attachments: {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'binary',
                  },
                },
              },
            },
          },
        },
      },
      responses: genCustomResFromCustomRef(
        getCustomSchemaRef('UploadResponse'),
        'array'
      ),
    }),
  },
  '/get-attachment': {
    ...summaryObject,
    get: genAuthRequest(attachmentTag, 'Get attachment by filename', {
      parameters: [
        genParameterItem(
          'filename',
          genVarchar(),
          'attachment name',
          true,
          'query'
        ),
      ],
      responses: {
        ...genDefaultRes(),
        200: {
          content: {
            'application/json': {
              schema: {
                type: 'string',
              },
            },
          },
        },
      },
    }),
  },
  '/list': {
    ...summaryObject,
    get: genAuthRequest(attachmentTag, 'Get list of attachment', {
      responses: genDefaultRes('array'),
    }),
  },
  '/txhash/{txHash}': {
    ...summaryObject,
    get: genAuthRequest(attachmentTag, 'Get detail of attachment by Tx Hash', {
      parameters: [genParameterItem('txHash', genVarchar(), 'Tx Hash')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Attachment is not found !'),
      },
    }),
  },
  '/{id}/is-deleted': {
    ...summaryObject,
    get: genAuthRequest(attachmentTag, 'Check attachment is deleted or not', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Attachment ID')],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'Attachment is not found !'),
      },
    }),
  },
  '/{id}/txhash': {
    ...summaryObject,
    get: genAuthRequest(attachmentTag, 'Get Tx Hash value by id', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Attachment ID')],
      responses: {
        ...txhashResponse,
        404: genFailRes(404, 'Attachment is not found !'),
      },
    }),
  },
  '/{id}/task-id': {
    ...summaryObject,
    get: genAuthRequest(attachmentTag, 'Get Task ID value by id', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Attachment ID')],
      responses: {
        ...foreignKey,
        404: genFailRes(404, 'Attachment is not found !'),
      },
    }),
  },
  '/{id}/user-id': {
    ...summaryObject,
    get: genAuthRequest(attachmentTag, 'Get User ID value by id', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Attachment ID')],
      responses: {
        ...foreignKey,
        404: genFailRes(404, 'Attachment is not found !'),
      },
    }),
  },
  '/{id}': {
    ...summaryObject,
    get: genAuthRequest(attachmentTag, 'Get detail of attachment', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Attachment ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Attachment is not found !'),
      },
    }),
    put: genAuthRequest(attachmentTag, 'Update attachment by id', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Attachment ID')],
      requestBody: genRequestBody(UPDATE_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes,
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Attachment is not found !'),
      },
    }),
    delete: genAuthRequest(attachmentTag, 'Delete attachment by id', {
      parameters: [genParameterItem('id', ID_SCHEMA, 'Attachment ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Attachment is not found !'),
      },
    }),
  },
  // Create new data
  '/': {
    ...summaryObject,
    post: genAuthRequest(attachmentTag, 'Create new attachment', {
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    }),
  },
};
