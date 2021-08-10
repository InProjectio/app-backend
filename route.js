const rootRoute = require('express').Router();
const swgJs = require('swagger-jsdoc');
const swgUi = require('swagger-ui-express');
const docDef = require('./docs');

const specs = swgJs({ definition: docDef, apis: ['./routes/*.js'] });
const swgUiOpts = {
  swaggerOptions: {
    filter: true,
    validatorUrl: null,
    displayOperationId: true,
  },
};

const checklistRoute = require('./modules/checklist/route');
const clItemRoute = require('./modules/checklist_item/route');
const clItemUserRoute = require('./modules/checklist_item_user/route');
const userRoute = require('./modules/user/route');
const workspaceRoute = require('./modules/workspace/route');
const projectRoute = require('./modules/project/route');
const folderRoute = require('./modules/folder/route');
const pjUserRoute = require('./modules/project_user/route');
const wsUserRoute = require('./modules/workspace_user/route');
const taskRoute = require('./modules/task/route');
const taskUserRoute = require('./modules/task_user/route');
const activityRoute = require('./modules/activity/route');
const activityUserRoute = require('./modules/activity_user/route');
const attachmentRoute = require('./modules/attachment/route');
const dependencyTaskRoute = require('./modules/dependency_task/route');
const labelRoute = require('./modules/label/route');
const taskLabelRoute = require('./modules/task_label/route');
const blockRoute = require('./modules/block/route');
// const emojiActRoute = require('./modules/emoji_activity/route');
const logRoute = require('./modules/log/route');
const timelineRoute = require('./modules/timeline/route');
const userBlockRoute = require('./modules/user_block/route');
const TransactionRoute  = require('./modules/transaction/route')

rootRoute.use('/api-docs', swgUi.serve, swgUi.setup(specs, swgUiOpts));
rootRoute.use('/user', userRoute);
rootRoute.use('/workspace', workspaceRoute);
rootRoute.use('/project', projectRoute);
rootRoute.use('/folder', folderRoute);
rootRoute.use('/checklist', checklistRoute);
rootRoute.use('/project-user', pjUserRoute);
rootRoute.use('/workspace-user', wsUserRoute);
rootRoute.use('/checklist-item', clItemRoute);
rootRoute.use('/checklist-item-user', clItemUserRoute);
rootRoute.use('/task', taskRoute);
rootRoute.use('/task-user', taskUserRoute);
rootRoute.use('/activity', activityRoute);
rootRoute.use('/activity-user', activityUserRoute);
rootRoute.use('/attachment', attachmentRoute);
rootRoute.use('/dependency-task', dependencyTaskRoute);
rootRoute.use('/label', labelRoute);
rootRoute.use('/task-label', taskLabelRoute);
rootRoute.use('/block', blockRoute);
// rootRoute.use('/emoji-activity', emojiActRoute);
rootRoute.use('/log', logRoute);
rootRoute.use('/timeline', timelineRoute);
rootRoute.use('/user-block', userBlockRoute);
rootRoute.use('/transaction', TransactionRoute);

module.exports = rootRoute;
