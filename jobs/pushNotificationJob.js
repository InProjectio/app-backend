var cron = require('node-cron');
const DB = require("../utils/db");
const moment = require('moment')

const { sendNotificationToClient } = require('../helpers/notify')

const taskSchema = require("../modules/task/schema");
const checklistItemSchema = require("../modules/checklist_item/schema");

const ChecklistItemModel = new DB(process.env.DB_NAME, checklistItemSchema);
const TaskModel = new DB(process.env.DB_NAME, taskSchema);

/**
 * Job push notification for task due date
 */
cron.schedule('* * * * *', async () => {
  console.log('running a task every minute');
  try {

    const result = await TaskModel.aggregate([
      {
        $match: {
          $and: [
            {deleted: 'n'},
            {
              status: {
                $ne: 'complete'
              }
            },
            {
              notificationTime: {
                $gt: moment().add(-1, 'minutes').unix()
              },
            },
            {
              notificationTime: {
                $lte: moment().unix()
              }
            },
            {
              members: {
                $exists: true, $ne: []
              }
            }
          ]
          
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members", //this is the _id user from tests
          foreignField: "_id", //this is the _id from users
          as: "users",
        },
      },
     
    ]);
    console.log('result ==>', result)
    result.forEach((task) => {
      const tokens = task.users.filter((user) => user.firebaseToken).map((user) => user.firebaseToken)
      // console.log('tokens', tokens)
      if (tokens && tokens.length > 0) {
        sendNotificationToClient(tokens, {
          title: 'Task overdue',
          body: `Task ${task.task_name} is overdue`
        })
      }
    })

  } catch (e) {
    console.log('job error', e)
  }
});

/**
 * Job push notification for checklist item
 */
cron.schedule('* * * * *', async () => {
  console.log('running a task every minute checklist item');
  try {

    const result = await ChecklistItemModel.aggregate([
      {
        $match: {
          $and: [
            {deleted: 'n'},
            {
              completed: 'n'
            },
            {
              end_date: {
                $gt: moment().add(-1, 'minutes').unix()
              },
            },
            {
              end_date: {
                $lte: moment().unix()
              }
            },
            {
              members: {
                $exists: true, $ne: []
              }
            }
          ]
          
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members", //this is the _id user from tests
          foreignField: "_id", //this is the _id from users
          as: "users",
        },
      },
     
    ]);
    console.log('result checklist item ==>', result)
    result.forEach((item) => {
      const tokens = item.users.filter((user) => user.firebaseToken).map((user) => user.firebaseToken)
      // console.log('tokens', tokens)
      if (tokens && tokens.length > 0) {
        sendNotificationToClient(tokens, {
          title: 'checklist item overdue',
          body: `Checklist item ${item.item_name} is overdue`
        })
      }
    })

  } catch (e) {
    console.log('job error', e)
  }
});