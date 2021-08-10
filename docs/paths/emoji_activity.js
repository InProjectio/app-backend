const tags = require('../tags');
const {
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
} = require('../helpers');

const { ID_SCHEMA, NEW_INPUT_SCHEMA, genDefaultRes } =
  genPathData('EmojiActivity');

module.exports = {
  '/emoji-activity': {
    summary: 'Emoji Activity APIs',
    description: 'CRUD APIs to interact with Emoji Activity Database',
    post: {
      tags: [tags.emojiAct],
      summary: 'Create new emoji activity',
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
      },
    },
  },
  '/emoji-activity/list': {
    summary: 'Emoji Activity APIs',
    description: 'CRUD APIs to interact with Emoji Activity Database',
    get: {
      tags: [tags.emojiAct],
      summary: 'Get list of emoji activity',
      responses: genDefaultRes('array'),
    },
  },
  '/emoji-activity/{id}': {
    summary: 'Emoji Activity APIs',
    description: 'CRUD APIs to interact with Emoji Activity Database',
    get: {
      tags: [tags.emojiAct],
      summary: 'Get detail of emoji activity',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Emoji Activity ID')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Emoji Activity is not found !'),
      },
    },
    put: {
      tags: [tags.emojiAct],
      summary: 'Update emoji activity by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Emoji Activity ID')],
      requestBody: genRequestBody(NEW_INPUT_SCHEMA, true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, 'Request is invalid !'),
        404: genFailRes(404, 'Emoji Activity is not found !'),
      },
    },
    delete: {
      tags: [tags.emojiAct],
      summary: 'Delete emoji activity by id',
      parameters: [genParameterItem('id', ID_SCHEMA, 'Emoji Activity ID')],
      responses: {
        ...genDefaultRes(),
        404: genFailRes(404, 'Emoji Activity is not found !'),
      },
    },
  },
};
