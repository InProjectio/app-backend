const tags = require('../tags');
const {
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
} = require('../helpers');

const { ID_SCHEMA, NEW_INPUT_SCHEMA, genDefaultRes, statusResponse } =
  genPathData('Txhash');

const summaryObject = {
  summary: 'Txhash APIs',
  description: 'CRUD APIs to interact with Txhash Database',
};

module.exports = {
  // Retrieve data
  '/{txhash}': {
    ...summaryObject,
    get: {
      tags: [tags.txhash],
      summary: 'Get detail of txhash',
      parameters: [genParameterItem('txhash', ID_SCHEMA, 'Txhash')],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, 'Txhash is not found !'),
      },
    },
  },
  '/{txhash}/is-outdate': {
    ...summaryObject,
    get: {
      tags: [tags.txhash],
      summary: 'Check the block is outdate or not',
      parameters: [genParameterItem('txhash', ID_SCHEMA, 'Txhash')],
      responses: {
        ...statusResponse,
        404: genFailRes(404, 'Txhash is not found !'),
      },
    },
  },
  // Create new data
  '/': {
    ...summaryObject,
    post: {
      tags: [tags.txhash],
      summary: 'Create new txhash',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
};
