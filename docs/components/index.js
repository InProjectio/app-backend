const user = require('./user');
const workspace = require('./workspace');
const project = require('./project');
const folder = require('./folder');
const checklist = require('./checklist');
const clItem = require('./checklist_item');
const clItemUser = require('./checklist_item_user');
const wsUser = require('./workspace_user');
const pjUser = require('./project_user');
const task = require('./task');
const taskUser = require('./task_user');
const depTask = require('./dependency_task');
const attachment = require('./attachment');
const activity = require('./activity');
const acUser = require('./activity_user');
const label = require('./label');
const taskLabel = require('./task_label');
const block = require('./block');
const userBlock = require('./user_block');
const timelineBlock = require('./timeline');
const log = require('./log');
const emojiAct = require('./emoji_activity');
const txhash = require('./txhash');

const rootSchema = {
  schemas: {
    ...user,
    ...workspace,
    ...project,
    ...folder,
    ...checklist,
    ...clItem,
    ...clItemUser,
    ...wsUser,
    ...pjUser,
    ...task,
    ...taskUser,
    ...depTask,
    ...attachment,
    ...activity,
    ...acUser,
    ...label,
    ...taskLabel,
    ...block,
    ...userBlock,
    ...timelineBlock,
    ...log,
    ...emojiAct,
    ...txhash,
  },
  securitySchemes: {
    UserToken: { type: 'apiKey', in: 'header', name: 'user-token' },
  },
};

module.exports = rootSchema;
