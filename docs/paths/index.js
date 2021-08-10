const { genPathRouteObject, genPathRouteObjectV2 } = require('../helpers');

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
const log = require('./log');
const emojiAct = require('./emoji_activity');
const timeline = require('./timeline');
const userBlock = require('./user_block');
const txhash = require('./txhash');

module.exports = {
  ...genPathRouteObjectV2(user, 'user'),
  ...genPathRouteObjectV2(workspace, 'workspace'),
  ...genPathRouteObjectV2(project, 'project'),
  ...genPathRouteObjectV2(folder, 'folder'),
  ...genPathRouteObjectV2(checklist, 'checklist'),
  ...genPathRouteObjectV2(clItem, 'checklist-item'),
  ...genPathRouteObjectV2(clItemUser, 'checklist-item-user'),
  ...genPathRouteObjectV2(wsUser, 'workspace-user'),
  ...genPathRouteObjectV2(pjUser, 'project-user'),
  ...genPathRouteObjectV2(task, 'task'),
  ...genPathRouteObjectV2(taskUser, 'task-user'),
  ...genPathRouteObject(depTask, '/dependency-task'),
  ...genPathRouteObjectV2(attachment, 'attachment'),
  ...genPathRouteObjectV2(activity, 'activity'),
  ...genPathRouteObject(acUser, '/activity-user'),
  ...genPathRouteObjectV2(label, 'label'),
  ...genPathRouteObjectV2(taskLabel, 'task_label'),
  ...genPathRouteObject(block, '/block'),
  ...genPathRouteObjectV2(log, 'log'),
  ...genPathRouteObject(emojiAct, '/emoji_activity'),
  ...genPathRouteObject(timeline, '/timeline'),
  ...genPathRouteObject(userBlock, '/user_block'),
  ...genPathRouteObjectV2(txhash, 'txhash'),
};
