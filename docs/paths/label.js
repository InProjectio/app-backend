const tags = require('../tags');
const {
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
} = require('../helpers');

const { ID_SCHEMA, NEW_INPUT_SCHEMA, UPDATE_INPUT_SCHEMA, genDefaultRes } =
  genPathData('Label');

const summaryObject = {
  summary: 'Label APIs',
  description: 'CRUD APIs to interact with Label Database',
};

module.exports = {
  // Retrieve data
  '/list': {
    ...summaryObject,
    get: {
      tags: [tags.label],
      summary: 'Get list of label',
      responses: genDefaultRes('array'),
    },
  },
  '/{id}': {
    ...summaryObject,
    get: {
      tags: [tags.label],
      summary: 'Get detail of label',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Label ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Label is not found !'),
      },
    },
    put: {
      tags: [tags.label],
      summary: 'Update label by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Label ID')],
      requestBody: genRequestBody(UPDATE_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes,
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Label is not found !'),
      },
    },
    delete: {
      tags: [tags.label],
      summary: 'Delete label by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Label ID')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Label is not found !'),
      },
    },
  },
  // Create new data
  '/': {
    ...summaryObject,
    post: {
      tags: [tags.label],
      summary: 'Create new label',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
};
