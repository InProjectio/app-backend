const DB = require("../utils/db");
const mongoose = require('mongoose');

const moment = require("moment");

const { cvtArrayToObject } = require("../helpers/transform_data");
const { isNumber, isEmptyString } = require("../helpers/validator");

const wsSchema = require("../modules/workspace/schema");
const pjSchema = require("../modules/project/schema");
const folderSchema = require("../modules/folder/schema");
const taskSchema = require("../modules/task/schema");
const emojiSchema = require('../modules/emoji_activity/schema')
// Workspace user
const wsUserSchema = require('../modules/workspace_user/schema')
// project user
const pjUserSchema = require('../modules/project_user/schema')
// Label Schemas
const labelSchema = require("../modules/label/schema");
const taskLabelSchema = require("../modules/task_label/schema");
// User
const userSchema = require("../modules/user/schema");
const taskUserSchema = require("../modules/task_user/schema");
// Checklist
const checklistSchema = require("../modules/checklist/schema");
const clItemSchema = require("../modules/checklist_item/schema");
const clItemUserSchema = require("../modules/checklist_item_user/schema");
// Attachment
const attachmentSchema = require("../modules/attachment/schema");

const activitySchema = require("../modules/activity/schema");

const WorkspaceModel = new DB(process.env.DB_NAME, wsSchema);
// const WorkspaceUserModel = new DB(process.env.DB_NAME, wsUserSchema);
const ProjectModel = new DB(process.env.DB_NAME, pjSchema);
const ProjectUserModel = new DB(process.env.DB_NAME, pjUserSchema);
const FolderModel = new DB(process.env.DB_NAME, folderSchema);
const TaskModel = new DB(process.env.DB_NAME, taskSchema);
// Label Models
const LabelModel = new DB(process.env.DB_NAME, labelSchema);
const TaskLabelModel = new DB(process.env.DB_NAME, taskLabelSchema);
// User Models
const UserModel = new DB(process.env.DB_NAME, userSchema);
const TaskUserModel = new DB(process.env.DB_NAME, taskUserSchema);
// Checklist Models
const ChecklistModel = new DB(process.env.DB_NAME, checklistSchema);
const ClItemModel = new DB(process.env.DB_NAME, clItemSchema);
const ClItemUserModel = new DB(process.env.DB_NAME, clItemUserSchema);
// Attachment Model
const AttachmentModel = new DB(process.env.DB_NAME, attachmentSchema);

const EmojiActivityModel = new DB(process.env.DB_NAME, emojiSchema);

const ActivityModel = new DB(process.env.DB_NAME, activitySchema);

module.exports.getTaskByStatus = async (inputScope) => {
  let result = [];
  // Define the scope of task list
  let scope = inputScope;
  if (["workspace", "project", "phase"].includes(inputScope) === false) {
    scope = "workspace";
  }
  // Define the data to get the task list by a specific condition
  let wsList, pjList, phaseList;
  let wsIds, pjIds, phaseIds;
  // Get workspace list
  if (scope === "workspace") {
    const query = {
      deleted: "n",
    };
    const projection = "-_id workspace_id workspace_name visible thumbnail_url";
    const opt = {
      lean: true,
    };
    wsList = await WorkspaceModel.getList(query, opt, projection);
    wsIds = wsList.map((wsItem) => wsItem.workspace_id);
  }
  // Get project list
  if (["workspace", "project"].indexOf(scope) >= 0) {
    const query = {
      deleted: "n",
    };
    if (Array.isArray(wsIds)) {
      query["workspace_id"] = {
        $in: wsIds,
      };
    }
    const projection = "-_id project_id project_name visible workspace_id";
    const opt = {
      lean: true,
    };
    pjList = await ProjectModel.getList(query, opt, projection);
    pjIds = pjList.map((pjItem) => pjItem.workspace_id);
  }
  // Get phase(folder) list
  if (["workspace", "project", "phase"].indexOf(scope) >= 0) {
    const query = {
      deleted: "n",
    };
    if (Array.isArray(pjIds)) {
      query["project_id"] = {
        $in: pjIds,
      };
    }
    const projection = "-_id folder_id folder_name visible project_id";
    const opt = {
      lean: true,
    };
    phaseList = await FolderModel.getList(query, opt, projection);
    phaseIds = phaseList.map((phaseItem) => phaseItem.project_id);
  }
  // Get task list
  let query = TaskModel.model
    .aggregate()
    .match({
      folder_id: { $in: phaseIds },
    })
    .group({
      _id: "$status",
      tasks: { $push: "$$ROOT" },
    })
    .project({
      _id: 0,
      status: "$_id",
      tasks: 1,
    });
  const taskList = await query.exec();
  if (taskList.length > 0) {
    if (scope === "workspace") {
      const wsDataObject = cvtArrayToObject(wsList, "workspace_id");
      const pjDataObject = cvtArrayToObject(pjList, "project_id");
      const phaseDataObject = cvtArrayToObject(phaseList, "folder_id");
    }
  }
  console.log(
    JSON.stringify(
      {
        result,
        phaseList,
      },
      null,
      2
    )
  );
  return result;
};

const _labelHandler = async (taskId, labels = [], isUpdating = false) => {
  try {

    if (labels && labels.length > 0) {
      /**
       * Remove old task labels
       */
      if (isUpdating) {
        await TaskLabelModel.model.deleteMany({
          task_id: taskId,
        });
      }

      const arrayData = [];
      for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        arrayData.push({
          task_id: taskId,
          label_id: label.id
        });
      }
      await TaskLabelModel.model.insertMany(arrayData, {
        lean: true,
        ordered: true,
      });
    }

  } catch (error) {
    console.error(error);
  }
  return true;
};

const _memberHandler = async (taskId, users, ownerId, isUpdating = false) => {
  try {
    const taskUserObject = {
      task_id: taskId,
      is_owner: "n",
      is_assignee: "y",
      watch: "y",
    };
    const arrayData = [];
    arrayData.push({
      ...taskUserObject,
      user_id: ownerId,
      is_assignee: "n",
      is_owner: "y",
    });
    if (users instanceof Array && users.length > 0) {
      for (let i = 0; i < users.length; i++) {
        const userId = users[i];
        const newTaskUserObject = {
          ...taskUserObject,
          user_id: userId,
        };
        arrayData.push(newTaskUserObject);
      }
    }
    if (isUpdating) {
      await TaskUserModel.model.deleteMany({
        task_id: taskId,
      });
    }
    await TaskUserModel.model.insertMany(arrayData, {
      lean: true,
      ordered: true,
    });
  } catch (error) {
    console.error(error);
  }
  return true;
};

const _createClItemUser = async (
  clItems,
) => {
  if (clItems && clItems.length > 0) {
    const newClItemUsers = [];
    for (let i = 0; i < clItems.length; i++) {
      const clItem = clItems[i];
      const memberIds = clItem.members
      const { item_id } = clItem;
      if (memberIds && memberIds.length > 0) {
        memberIds.forEach((memberId) => {
          newClItemUsers.push({
            item_id,
            user_id: memberId,
            is_assigner: "n",
            is_assignee: "y",
          });
        });
      }
    }
    await ClItemUserModel.model.insertMany(newClItemUsers, {
      lean: true,
      ordered: true,
    });
  }
  return true;
};

const _createClItem = async (checklistId, items) => {
  const clItems = [];
  const clItemIds = [];
  if (items && items.length > 0) {
    for (let i = 0; i < items.length; i++) {
      const checklistItem = items[i];
      const name = checklistItem.name;
      const order = checklistItem.order || i + 1;
      const status = checklistItem.status || "todo";
      const endDate = checklistItem.endDate || null;
      const clItemData = {
        checklist_id: checklistId,
        item_name: name,
        order,
        status,
        end_date: endDate,
      };
      if (checklistItem.id && isNumber(checklistItem.id)) {
        try {
          const clItem = await ClItemModel.updateOneById(
            {
              field: "item_id",
              value: checklistItem.id,
              otherOptions: {
                checklist_id: checklistId,
                deleted: "n",
              },
            },
            clItemData
          );
          clItemIds.push(clItem.item_id);
          clItems.push({...clItem, members: checklistItem.members});
        } catch (error) {
          clItem = null;
        }
      } else {
        const newClItem = await ClItemModel.createNew(clItemData);
        clItemIds.push(newClItem.item_id);
        clItems.push({...newClItem, members: checklistItem.members});
      }
    }
  }
  if (clItemIds.length > 0) {
    await Promise.all([
      ClItemModel.model.deleteMany({
        item_id: { $nin: clItemIds },
        checklist_id: checklistId
      }),
      ClItemUserModel.model.deleteMany({
        item_id: { $nin: clItemIds },
        checklist_id: checklistId
      }),
    ]);
  }
  return clItems;
};

const _checkListHandler = async (
  taskId,
  checklist,
  taskOwnerId,
  memberIds = [],
  isUpdating = false
) => {
  try {
    // CREATE CASE
    if (!isUpdating) {
      if (checklist && checklist.length > 0) {
        for (let i = 0; i < checklist.length; i++) {
          const { title, items, showCheckedItem } = checklist[i];
          // create check list
          const checklistData = {
            task_id: taskId,
            checklist_title: title,
            show_checked_item: showCheckedItem || 'y'
          };
          const newCheckList = await ChecklistModel.createNew(checklistData);
    
          clItems = await _createClItem(newCheckList.checklist_id, items);
          if (clItems.length > 0) {
            await _createClItemUser(clItems, taskOwnerId);
          }
        }
      }
    } else {
      // UPDATE CASE
      if (isEmptyString(data.title) === false) {
        if (isNumber(data.id)) {
          const checklist = await ChecklistModel.model.findOneAndUpdate(
            {
              task_id: taskId,
              checklist_id: data.id,
              deleted: "n",
            },
            { checklist_title: data.title },
            { lean: true, timestamps: true, new: true }
          );
          const clItems = await _createClItem(
            checklist.checklist_id,
            data.items
          );
          if (clItems.length > 0) {
            await _createClItemUser(clItems);
          }
        } else {
          await ChecklistModel.model.findOneAndUpdate(
            {
              task_id: taskId,
              deleted: "n",
            },
            { deleted: "y" },
            { lean: true, timestamps: true, new: true }
          );
          const newChecklist = await ChecklistModel.createNew({
            task_id: taskId,
            checklist_title: data.title,
          });
          const clItems = await _createClItem(
            newChecklist.checklist_id,
            data.items
          );
          if (clItems.length > 0) {
            await _createClItemUser(clItems, taskOwnerId);
          }
        }
      } else if (!data || Object.keys(data).length === 0) {
        // udpate delete status = y
        await ChecklistModel.updateOneById(
          {
            field: "task_id",
            value: taskId,
            otherOptions: {
              deleted: "n",
            },
          },
          { deleted: "y" },
          { new: true, lean: true, lean: true }
        );
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const _attachmentHandler = async (
  taskId,
  currentUserId,
  attachments,
  isUpdating = false
) => {
  try {
    const attIds = [];
    if (attachments instanceof Array && attachments.length > 0) {
      for (let i = 0; i < attachments.length; i++) {
        const { name, link, location } = attachments[i];
        const attachmentData = {
          attachment_location: location,
          attachment_name: name,
          attachment_link: link,
          user_id: currentUserId,
          task_id: taskId,
        };
        if (isUpdating) {
          if (isNumber(attachments[i]["id"])) {
            const updateQuery = {
              field: "attachment_id",
              value: attachments[i]["id"],
              otherOptions: {
                deleted: "n",
              },
            };
            const attData = await AttachmentModel.updateOneById(
              updateQuery,
              attachmentData
            );
            attIds.push(attData.attachment_id);
          } else {
            const newAtt = await AttachmentModel.createNew(attachmentData);
            attIds.push(newAtt.attachment_id);
          }
        } else {
          const newAtt = await AttachmentModel.createNew(attachmentData);
          attIds.push(newAtt.attachment_id);
        }
      }
    }
    await AttachmentModel.model.updateMany(
      {
        task_id: taskId,
        user_id: currentUserId,
        attachment_id: { $nin: attIds },
      },
      {
        deleted: "y",
      }
    );
  } catch (error) {
    console.error(error);
  }
  return true;
};

module.exports.createTask = async (taskData, currentUserId) => {

  TaskModel.validateData(taskData);
  const newTask = await TaskModel.createNew(taskData);
  /*await Promise.all([
    _labelHandler(newTask.task_id, labels),
    _memberHandler(newTask.task_id, members_user_id, currentUserId),
    _checkListHandler(newTask.task_id, checklist, currentUserId, members_user_id),
    _attachmentHandler(newTask.task_id, currentUserId, attachments),
  ]); */
  return newTask;
};

getName = (user) => {
  return user.username
}

getCurrentDate = () => {
  return moment().format('DD/MM/YYYY HH:mm')
}

module.exports.updateTask = async (taskId, taskData, currentUser) => {
  let updateData = taskData
  if (taskData.duedate_reminder || taskData.end_date) {
    updateData.notificationTime = (taskData.duedate_reminder && +taskData.duedate_reminder > 0)
    ? moment.unix(taskData.end_date).add(-(+taskData.duedate_reminder), 'minutes').unix()
    : moment.unix(taskData.end_date).unix()
  }
  try {
    const result = await TaskModel.updateOneById(
      {
        field: "task_id",
        value: taskId,
      },
      updateData
    );
    const currentDate = moment().format('DD/MM/YYYY HH:mm')
    let activityContent = ''
    if (taskData.task_name) {
      activityContent = `update ${result.task_name} to ${taskData.task_name}`
    } else if (taskData.description) {
      activityContent = `set update description`
    } else if (taskData.start_date) {
      activityContent = `set start date to ${moment.unix(taskData.start_date).format('DD/MM/YYYY HH:mm')}`
    } else if (taskData.end_date) {
      activityContent = `set due date to ${moment.unix(taskData.end_date).format('DD/MM/YYYY HH:mm')}`
    } else if (taskData.estimate) {
      activityContent = `set estimate to ${taskData.estimate} hours`
    } else if (taskData.duedate_reminder) {
      activityContent = `set due date reminder to ${taskData.duedate_reminder} minutes`
    } else if (taskData.status) {
      activityContent = `change status from ${result.status} to ${taskData.status}`
    } else if (taskData.budget) {
      activityContent = `set budget to ${taskData.budget}`
    } else if (taskData.spend) {
      activityContent = `set spend to ${taskData.spend}`
    }
    if (activityContent) {
      const activity = await this.addActivity({
        task_id: taskId,
        user_id: currentUser.user_id,
        userId: currentUser._id,
        activity_content: activityContent,
        type: 'SYSTEM',
        currentUser
      })
      return {activity};
    }

    return true
    
  } catch(e) {
    console.log('e ===>', e)
    return Promise.reject(e);
  }
  
};

getFolderIds = async (folderQuery) => {
  const folderOpt = {
    lean: true,
    sort: {
      folder_id: 1,
    },
  };
  const folderProjection = "folder_id project_id folder_name visible -_id";
  const folderList = await FolderModel.getList(
    folderQuery,
    folderOpt,
    folderProjection
  );
  const folderMap = new Map();
  const folderIds = folderList.map((folderItem) => {
    folderMap.set(folderItem.folder_id, folderItem);
    return folderItem.folder_id;
  });
  return { folderIds, folderMap };
};

getSortName = (sortName) => {
  if (sortName === 'taskName') {
    return 'task_name'
  }
  if (sortName === 'endDate') {
    return 'end_date'
  }
  return sortName
}

getSortObj = (sorts) => {
  let sortObj = {};
  const arraySorts = sorts.split(",");
  arraySorts.forEach((item) => {
    const [sortName, sortType] = item.split("_");
    sortObj[getSortName(sortName)] = sortType === "ASC" ? 1 : -1;
  });
  return sortObj;
};

module.exports.findTasks = async (query, user_id) => {
  try {
    const {
      spaceId,
      projectId,
      phaseId,
      startDate,
      endDate,
      textSearch,
      groupBy = "STATUS",
      members,
      page = 1,
      pageSize = 20,
      sorts,
      sortAll,
    } = query;

    let folderIds = [];
    const projectMap = new Map();
    let folderMap = new Map();
    if (spaceId && !projectId && !phaseId) {
      const pjQuery = {
        deleted: "n",
        workspace_id: +spaceId,
        txhash: {
          $ne: null
        },
        visible: 'y'
      };
      const pjOpt = {
        lean: true,
        sort: {
          project_id: 1,
        },
      };
      const pjProjection = "project_id workspace_id project_name visible -_id";
      let [projectList, userInProjectsResult] = await Promise.all([
        ProjectModel.getList(
          pjQuery,
          pjOpt,
          pjProjection
        ),
        ProjectUserModel.aggregate([
          {
            $match: {
              user_id: user_id,
              is_accepted: 'y'
            },
          },
          {
            $lookup: {
              from: "projects",
              localField: "project_id", //this is the _id user from tests
              foreignField: "project_id", //this is the _id from users
              as: "project",
            },
          },
          {
            "$addFields": {
                "project": {
                    "$arrayElemAt": [
                        {
                            "$filter": {
                                "input": "$project",
                                "as": "project",
                                "cond": {
                                    $and: [
                                      {"$eq": [ "$$project.deleted", "n" ]},
                                      {"$eq": [ "$$project.visible", "n" ]},
                                      {"$eq": [ "$$project.workspace_id", +spaceId ]},
                                    ]
                                }
                            }
                        }, 0
                    ]
                }
            }
          },
        ])
      ])
      let pjIds = projectList.map((pjItem) => {
        projectMap.set(pjItem.project_id, pjItem);
        return pjItem.project_id;
      });
    
      userInProjectsResult
        .filter((item) => item.project && item.project.txhash)
        .forEach((item) => {
          if (pjIds.indexOf(item.project_id) === -1) {
            pjIds = [item.project_id,  ...pjIds]
            projectMap.set(item.project_id, {...item.project,
              ...item,});
          }
        })
      
      const folderQuery = {
        deleted: "n",
        project_id: { $in: pjIds },
        txhash: {
          $ne: null
        }
      };

      const result = await getFolderIds(folderQuery);
      folderIds = result.folderIds;
      folderMap = result.folderMap;
    } else if (projectId && !phaseId) {
      const folderQuery = {
        deleted: "n",
        project_id: projectId,
        txhash: {
          $ne: null
        }
      };
      const result = await getFolderIds(folderQuery);
      folderIds = result.folderIds;
      folderMap = result.folderMap;
    } else {
      folderIds = [+phaseId];
      const folder = await FolderModel.findOne({ folder_id: +phaseId });
      folderMap.set(+phaseId, folder.toObject());
    }

    let taskQuery = {
      folder_id: { $in: folderIds },
      deleted: 'n',
      txhash: {
        $ne: null
      }
    };

    if (textSearch) {
      taskQuery["$text"] = { $search: textSearch };
    }

    if (members) {
      taskQuery = {
        ...taskQuery,
        members: {
          $in: members.split(',').map((item) => mongoose.Types.ObjectId(item))
        }
      }
    }

    let sort = {};

    if (groupBy === "STATUS") {
      sort = { "folders.project_id": 1, folder_id: 1, status: 1, task_id: 1 };
    } else if (groupBy === "DUE_DATE") {
      sort = { endDate: 1, stat: 1, end_date: 1 };
    } else if (groupBy === "ASSIGNEE") {
      sort = { folder_id: 1 };
    }

    if (sorts) {
      sort = { ...getSortObj(sorts), ...sort };
    }

    console.log('taskQuery', taskQuery)

    const result = await TaskModel.aggregate([
      { $match: taskQuery },
      {
        $lookup: {
          from: "folders",
          localField: "folder", //this is the _id user from tests
          foreignField: "_id", //this is the _id from users
          as: "folders",
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
      {
        "$project": {
          "users.password": 0
        }
      },
      {
        $set: {
          endDate: {
            $cond: { if: { $eq: ["$end_date", ""] }, then: 1, else: 0 },
          },
        },
      },
      {
        $set: {
          stat: {
            $cond: { if: { $eq: ["$status", "ready"] }, then: 1, else: 0 },
          },
        },
      },
      {
        $facet: {
          edges: [
            { $sort: sort },
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
          ],
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ]);

    let docs = result[0].edges.map((item) => {
      // console.log('item ===>', item)
      const phase = folderMap.get(item.folder_id);
      const project = phase && projectMap.get(phase.project_id);
      return {
        ...item,
        phase: {
          ...phase,
          projectName: project ? project.project_name : "",
        },
        project,
      };
    });

    return { pageInfo: result[0].pageInfo[0], docs };
  } catch (e) {
    return Promise.reject(e);
  }
};

findFolderIds = async (spaceId, projectId, phaseId, user_id) => {
  let folderIds = [];
  if (spaceId && !projectId && !phaseId) {
    const pjQuery = {
      deleted: "n",
      workspace_id: +spaceId,
      txhash: {
        $ne: null
      },
      visible: 'y'
    };
    const pjOpt = {
      lean: true,
      sort: {
        project_id: 1,
      },
    };
    const pjProjection = "project_id workspace_id project_name visible -_id";
    let [projectList, userInProjectsResult] = await Promise.all([
      ProjectModel.getList(
        pjQuery,
        pjOpt,
        pjProjection
      ),
      ProjectUserModel.aggregate([
        {
          $match: {
            user_id: user_id,
            is_accepted: 'y'
          },
        },
        {
          $lookup: {
            from: "projects",
            localField: "project_id", //this is the _id user from tests
            foreignField: "project_id", //this is the _id from users
            as: "project",
          },
        },
        {
          "$addFields": {
              "project": {
                  "$arrayElemAt": [
                      {
                          "$filter": {
                              "input": "$project",
                              "as": "project",
                              "cond": {
                                  $and: [
                                    {"$eq": [ "$$project.deleted", "n" ]},
                                    {"$eq": [ "$$project.visible", "n" ]},
                                    {"$eq": [ "$$project.workspace_id", +spaceId ]},
                                  ]
                              }
                          }
                      }, 0
                  ]
              }
          }
        },
      ])
    ])
  
    let pjIds = projectList.map((pjItem) => {
      return pjItem.project_id;
    });

    userInProjectsResult
        .filter((item) => item.project && item.project.txhash)
        .forEach((item) => {
          if (pjIds.indexOf(item.project_id) === -1) {
            pjIds = [item.project_id,  ...pjIds]
          }
        })

    const folderQuery = {
      deleted: "n",
      project_id: { $in: pjIds },
    };

    const result = await getFolderIds(folderQuery);
    folderIds = result.folderIds;
  } else if (projectId && !phaseId) {
    const folderQuery = {
      deleted: "n",
      project_id: projectId,
    };
    const result = await getFolderIds(folderQuery);
    folderIds = result.folderIds;
  } else {
    folderIds = [+phaseId];
  }
  return folderIds
}

module.exports.findTasksCalendar = async (query, user_id) => {
  try {
    const { textSearch, spaceId, projectId, phaseId, members } = query
    const startDate = query.startDate;
    const endDate = query.endDate;
    const folderIds = await findFolderIds(spaceId, projectId, phaseId, user_id)
    console.log('folderIds ====>', folderIds)
    let taskQuery = {
      deleted: 'n',
      folder_id: { $in: folderIds },
      txhash: {
        $ne: null
      },
      $or: [
        {
          $and: [
            { start_date: { $lte: startDate } },
            { end_date: { $gte: startDate } }
          ],
          $and: [
            { start_date: { $gte: startDate } },
            { start_date: { $lte: endDate } }
          ],
        },
      ],

    }
    if (textSearch) {
      taskQuery["$text"] = { $search: textSearch };
    }
    if (members) {
      taskQuery['members'] = {
        $in: members.split(',')
      }
    }
    const result = await TaskModel.model.find(taskQuery).populate('folder');
    return result;
  } catch (e) {
    return Promise.reject();
  }
};


module.exports.getTasksByGroup = async (query, page = 1, pageSize = 10) => {
  try {
    const result = await TaskModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "folders",
          // localField: "folder", //this is the _id user from tests
          // foreignField: "_id", //this is the _id from users
          "let": { "folder_id": "$folder_id" },
          "pipeline": [
            { "$match": { "$expr": { "$eq": [ "$folder_id", "$$folder_id" ] } } },
            { "$lookup": {
              from: "projects",
              localField: "project_id",
              foreignField: "project_id",
              as: 'projects'
            }},
            { $unwind: "$projects"}
          ],
          as: "folders",
        },
      },
      { $unwind: "$folders"},
      {
        $lookup: {
          from: "users",
          localField: "members", //this is the _id user from tests
          foreignField: "_id", //this is the _id from users
          as: "users",
        },
      },
      {
        $project: {
          "users.password": 0
        }
      },
      {
        $facet: {
          edges: [
            { $sort: { "folders.project_id": 1, folder_id: 1, task_id: 1 }},
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
          ],
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ]);
  
    return { pageInfo: result[0].pageInfo[0], docs: result[0].edges };
  } catch (e) {
    console.log('getTasksByGroup error', e)
    return Promise.reject();
  }
}

const queryDueDate = {
  overdue: {
    status: {$nin: ['complete']},
    end_date: { $lt: moment().unix() }
  },
  today: {
    status: {$nin: ['complete']},
    $and: [
      { end_date: { $gt: moment(moment().format('YYYY-MM-DD 00:00')).unix() }},
      { end_date: { $lt: moment(moment().format('YYYY-MM-DD 23:59')).unix() }}
    ]
  },
  tomorrow: {
    status: {$nin: ['complete']},
    $and: [
      { end_date: { $gt: moment(moment().add(1, 'days').format('YYYY-MM-DD 00:00')).unix() }},
      { end_date: { $lt: moment(moment().add(1, 'days').format('YYYY-MM-DD 23:59')).unix() }}
    ]
  },
  day2: {
    status: {$nin: ['complete']},
    $and: [
      { end_date: { $gt: moment(moment().add(2, 'days').format('YYYY-MM-DD 00:00')).unix() }},
      { end_date: { $lt: moment(moment().add(2, 'days').format('YYYY-MM-DD 23:59')).unix() }}
    ]
  },
  day3: {
    status: {$nin: ['complete']},
    $and: [
      { end_date: { $gt: moment(moment().add(3, 'days').format('YYYY-MM-DD 00:00')).unix() }},
      { end_date: { $lt: moment(moment().add(3, 'days').format('YYYY-MM-DD 23:59')).unix() }}
    ]
  },
  day4: {
    status: {$nin: ['complete']},
    $and: [
      { end_date: { $gt: moment(moment().add(4, 'days').format('YYYY-MM-DD 00:00')).unix() }},
      { end_date: { $lt: moment(moment().add(4, 'days').format('YYYY-MM-DD 23:59')).unix() }}
    ]
  },
  day5: {
    status: {$nin: ['complete']},
    $and: [
      { end_date: { $gt: moment(moment().add(5, 'days').format('YYYY-MM-DD 00:00')).unix() }},
      { end_date: { $lt: moment(moment().add(5, 'days').format('YYYY-MM-DD 23:59')).unix() }}
    ]
  },
  day6: {
    status: {$nin: ['complete']},
    $and: [
      { end_date: { $gt: moment(moment().add(6, 'days').format('YYYY-MM-DD 00:00')).unix() }},
      { end_date: { $lt: moment(moment().add(6, 'days').format('YYYY-MM-DD 23:59')).unix() }}
    ]
  },
  future: {
    status: {$nin: ['complete']},
    end_date: {
      $gt: moment(moment().add(7, 'days').format('YYYY-MM-DD 00:00')).unix()
    }
  },
  done: {
    status: {$in: ['complete']},
  },
  noDueDate: {
    status: {$nin: ['complete']},
    end_date: null
  }
}

module.exports.findTasksBoardLoadmore = async (query, user_id) => {
  try {
    const { textSearch, spaceId, projectId, phaseId, members, groupBy = 'STATUS', page, pageSize = 10,
      groupId
    } = query
    const folderIds = await findFolderIds(spaceId, projectId, phaseId, user_id)

    let taskQuery = {
      deleted: 'n',
      folder_id: { $in: folderIds },
      txhash: {
        $ne: null
      }
    }
    if (textSearch) {
      taskQuery["$text"] = { $search: textSearch };
    }
    if (members) {
      taskQuery['members'] = {
        $in: members.split(',')
      }
    }

    if (!groupBy || groupBy === 'STATUS') {
      taskQuery['status'] = groupId
    } else if (groupBy ===  'DUE_DATE') {
      taskQuery = {
        ...taskQuery,
        ...queryDueDate[groupId]
      }
    } else if (groupBy ===  'ASSIGNEE') {
      if (groupId === 'unassign') {
        taskQuery = {
          ...taskQuery,
          members: {
            $exists:true,
            $size:0
          }
        }
      } else {
        taskQuery = {
          ...taskQuery,
          members: mongoose.Types.ObjectId(groupId)
        }
      }
     
    }

    const result = await this.getTasksByGroup(taskQuery, +page, +pageSize)

    return result;
  } catch (e) {
    return Promise.reject();
  }
}


module.exports.findTasksByAssignee = async (query, user_id) => {
  try {
    const { textSearch, spaceId, projectId, phaseId, members, page = 1, pageSize = 20  } = query
    const folderIds = await findFolderIds(spaceId, projectId, phaseId, user_id)

    let taskQuery = {
      "deleted": 'n',
      "folder_id": { $in: folderIds },
      txhash: {
        $ne: null
      }
    }
    let conditions = []
    if (textSearch) {
      taskQuery["$text"] = { $search: textSearch };
      conditions = [...conditions,
        {"$regex": [ "$$task.task_name",  textSearch ]}
      ]
    }
    if (members) {
      taskQuery['members'] = {
        $in: members.split(',').map((item) => mongoose.Types.ObjectId(item))
      }
      conditions = [...conditions,
        {"$in": [ "$$task.members", members.split(',').map((item) => mongoose.Types.ObjectId(item)) ]}
      ]
    }

    const result = await TaskUserModel.aggregate([
      { $match: {},
      },
      {
        $lookup: {
          from: "tasks",
          localField: "task_id", //this is the _id user from tests
          foreignField: "task_id", //this is the _id from users
          as: "tasks",
        },
      },
      {
        "$addFields": {
            "tasks": {
                "$arrayElemAt": [
                    {
                        "$filter": {
                            "input": "$tasks",
                            "as": "task",
                            "cond": {
                                $and: [
                                  {"$eq": [ "$$task.deleted", "n" ]},
                                  {"$in": [ "$$task.folder_id", folderIds ]},
                                  ...conditions
                                ]
                            }
                        }
                    }, 0
                ]
            }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id", //this is the _id user from tests
          foreignField: "user_id", //this is the _id from users
          as: "currentUser",
        },
      },
      { $unwind: '$currentUser' },
      {
        $lookup: {
          from: "folders",
          localField: "tasks.folder", //this is the _id user from tests
          foreignField: "_id", //this is the _id from users
          as: "folders",
        },
      },
      { $unwind: '$folders' },
      {
        $lookup: {
          from: "users",
          localField: "tasks.members", //this is the _id user from tests
          foreignField: "_id", //this is the _id from users
          as: "members",
        },
      },
      {
        $project: {
          "currentUser.password": 0,
          "members.password": 0
        }
      },
      {
        $facet: {
          edges: [
            { $sort: { user_id: 1, "folders.project_id": 1, "tasks.folder_id": 1, task_id: 1 }},
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
          ],
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ]);

    const count = result[0].pageInfo[0] && result[0].pageInfo[0].count

    const totalPages = Math.ceil(count / 20)

    console.log('totalPages', totalPages, page)

    let docs = result[0].edges
    let pageInfo = result[0].pageInfo[0]
    if (page >= totalPages) {
      const unassign = await this.getTasksByGroup({
        ...taskQuery,
        members: {
          $exists:true,
          $size:0
        }
      }, (page - totalPages + 1), 10)

      pageInfo = {
        count: pageInfo.count + (unassign.pageInfo ? unassign.pageInfo.count : 0)
      }
      docs = [...docs, ...unassign.docs]
    }
  
    return { pageInfo, docs};

  } catch (e) {
    console.log('e', e)
    return Promise.reject();
  }
}

module.exports.clearUserTaskOverdue = async (data, user_id) => {
  try {
    await Promise.all(
      data.map((item) => (
        TaskUserModel.model.findOneAndUpdate({
          user_id,
          task_id: +item.task_id
        }, { cleared: item.cleared })
      ))
    )
    return true
  } catch(e) {
    return Promise.reject()
  }
}

module.exports.findUserTasksOverdule = async (query, user_id) => {
  try {
    const { page = 1, pageSize = 20, cleared = 'n'  } = query

    console.log('moment().unix()', moment().unix())

    const result = await TaskUserModel.aggregate([
      { $match: {
        cleared,
        user_id: user_id
      },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "task_id", //this is the _id user from tests
          foreignField: "task_id", //this is the _id from users
          as: "tasks",
        },
      },
      {
        "$addFields": {
            "tasks": {
                "$arrayElemAt": [
                    {
                        "$filter": {
                            "input": "$tasks",
                            "as": "task",
                            "cond": {
                                $and: [
                                  {"$eq": [ "$$task.deleted", "n" ]},
                                  {"$lt": ["$$task.notificationTime", moment().unix()]},
                                  {"$in": ["$$task.status", ['todo', 'progress', 'ready']]}
                                ]
                            }
                        }
                    }, 0
                ]
            }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id", //this is the _id user from tests
          foreignField: "user_id", //this is the _id from users
          as: "currentUser",
        },
      },
      { $unwind: '$currentUser' },
      {
        $lookup: {
          from: "folders",
          localField: "tasks.folder", //this is the _id user from tests
          foreignField: "_id", //this is the _id from users
          as: "folders",
        },
      },
      { $unwind: '$folders' },
      {
        $lookup: {
          from: "projects",
          localField: "folders.project_id", //this is the _id user from tests
          foreignField: "project_id", //this is the _id from users
          as: "projects",
        },
      },
      { $unwind: '$projects' },
      {
        $lookup: {
          from: "workspaces",
          localField: "projects.workspace_id", //this is the _id user from tests
          foreignField: "workspace_id", //this is the _id from users
          as: "workspaces",
        },
      },
      { $unwind: '$workspaces' },
      {
        $lookup: {
          from: "users",
          localField: "tasks.members", //this is the _id user from tests
          foreignField: "_id", //this is the _id from users
          as: "members",
        },
      },
      {
        $project: {
          "currentUser.password": 0,
          "members.password": 0
        }
      },
      {
        $facet: {
          edges: [
            { $sort: { user_id: 1, "folders.project_id": 1, "tasks.folder_id": 1, task_id: 1 }},
            { $skip: (page - 1) * pageSize },
            { $limit: pageSize },
          ],
          pageInfo: [{ $group: { _id: null, count: { $sum: 1 } } }],
        },
      },
    ]);

    console.log('result ====>', page, pageSize, user_id)
  
    return { pageInfo: result[0].pageInfo[0], docs: result[0].edges};

  } catch (e) {
    console.log('tung test ====> ', e)
    return Promise.reject(e);
  }
}

const dueDates = [{
  title: 'Overdue',
  id: 'overdue',
}, {
  title: 'Today',
  id: 'today',
}, {
  title: 'Tomorrow',
  id: 'tomorrow',
}, {
  title: moment().add(2, 'days').format('dddd'),
  id: 'day2',
}, {
  title: moment().add(3, 'days').format('dddd'),
  id: 'day3',
}, {
  title: moment().add(4, 'days').format('dddd'),
  id: 'day4',
}, {
  title: moment().add(5, 'days').format('dddd'),
  id: 'day5',
}, {
  title: moment().add(6, 'days').format('dddd'),
  id: 'day6',
}, {
  title: 'Future',
  id: 'future',
}, {
  title: 'Done',
  id: 'done',
}]

module.exports.findTasksBoard = async (query, user_id) => {
  try {
    const { textSearch, spaceId, projectId, phaseId, members, groupBy = 'STATUS' } = query
    const folderIds = await findFolderIds(spaceId, projectId, phaseId, user_id)

    let taskQuery = {
      deleted: 'n',
      folder_id: { $in: folderIds },
      txhash: {
        $ne: null
      }
    }

    if (textSearch) {
      taskQuery["$text"] = { $search: textSearch };
    }
    if (members) {
      taskQuery['members'] = {
       $in: members.split(',')
      }
    }

    if (!groupBy || groupBy === 'STATUS') {
      const [todo, progress, ready, complete] = await Promise.all([
        this.getTasksByGroup({...taskQuery, status: 'todo'}, 1, 10),
        this.getTasksByGroup({...taskQuery, status: 'progress'}, 1, 10),
        this.getTasksByGroup({...taskQuery, status: 'ready'}, 1, 10),
        this.getTasksByGroup({...taskQuery, status: 'complete'}, 1, 10)
      ])
      return [{
        id: 'todo',
        title: 'Todo',
        pageInfo: todo.pageInfo,
        tasks: todo.docs
      }, {
        id: 'progress',
        title: 'In Progress',
        pageInfo: progress.pageInfo,
        tasks: progress.docs
      }, {
        id: 'ready',
        title: 'Ready',
        pageInfo: ready.pageInfo,
        tasks: ready.docs
      }, {
        id: 'complete',
        title: 'Complete',
        pageInfo: complete.pageInfo,
        tasks: complete.docs
      }]
    } else if (groupBy === 'DUE_DATE') {
      const datas = await Promise.all(
        dueDates.map((item) => (
          this.getTasksByGroup({
            ...taskQuery,
            ...queryDueDate[item.id]
          }, 1, 10)
        ))
      )
        
      return datas.map((data, i) => ({
        pageInfo: data.pageInfo,
        tasks: data.docs,
        ...dueDates[i]
      }))

    } else if (groupBy === 'ASSIGNEE') {
      let users = []
      if (spaceId && !projectId) {
        const projects = await ProjectModel.model.find({
          workspace_id: +spaceId
        })
        const projectIds = projects.map((item) => item.project_id)
        // console.log('projectIds', projectIds)
        const projectUsers = await ProjectUserModel.aggregate([
          {
            $match: {
              project_id: {
                $in: projectIds
              }
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "user_id", //this is the _id user from tests
              foreignField: "user_id", //this is the _id from users
              as: "users",
            },
          },
        ]);
        let userIds = []
        projectUsers.forEach((item) => {
          if (userIds.indexOf(item.user_id) === -1) {
            userIds = [...userIds, item.user_id]
            users = [...users, item]
          }
        })
      } else if (projectId) {
        users = await ProjectUserModel.aggregate([
          {
            $match: {
              project_id: +projectId
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "user_id", //this is the _id user from tests
              foreignField: "user_id", //this is the _id from users
              as: "users",
            },
          },
        ]);
      }

      console.log('tung users ===>', users)

      const datas = await Promise.all([...users.map((user) => {
        return (
          this.getTasksByGroup({
            ...taskQuery,
            members: user.users[0]._id
          }, 1, 10)
      )}),
      this.getTasksByGroup({
        ...taskQuery,
        members: {
          $exists:true,
          $size:0
        }
      }, 1, 10)
    
    ])

      const groupTasks = datas.map((data, i) => {
        if (i <= datas.length - 2) {
          return ({
            pageInfo: data.pageInfo,
            tasks: data.docs,
            ...users[i],
            title: users[i].users[0].username || users[i].users[0].fullname,
            id: users[i].users[0]._id
          })
        }
        return {
          pageInfo: data.pageInfo,
          tasks: data.docs,
          id: 'unassign',
          title: 'Unassign'
        }
        
      })

      return groupTasks
    }
    
    return {};
  } catch (e) {
    console.log('error ===>', e)
    return Promise.reject();
  }
};

module.exports.getTaskAttachments = async (taskId) => {
  try {
    const result = await AttachmentModel.model.find({task_id: +taskId, deleted: 'n'})
    return result;
  } catch (e) {
    return Promise.reject();
  }
}

module.exports.getTaskLabels = async (taskId) => {
  try {
    const result = await TaskLabelModel.aggregate([
      {
        $match: {
          task_id: +taskId,
          txhash: {
            $ne: null
          }
        }
      },
      {
        $lookup: {
          from: "labels",
          localField: "label_id", //this is the _id user from tests
          foreignField: "label_id", //this is the _id from users
          as: "label",
        },
      },
    ]);
    return result;
  } catch (e) {
    return Promise.reject();
  }
}

module.exports.getTaskMembers = async (taskId) => {
  try {
    const result = await TaskUserModel.aggregate([
      {
        $match: {
          task_id: +taskId,
          txhash: {
            $ne: null
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user_id", //this is the _id user from tests
          foreignField: "user_id", //this is the _id from users
          as: "user",
        },
      },
    ]);
    return result;
  } catch (e) {
    return Promise.reject();
  }
}

module.exports.getTaskChecklists = async (taskId) => {
  try {
    const result = await ChecklistModel.aggregate([
      {
        $match: {
          task_id: +taskId,
          deleted: 'n',
          txhash: {
            $ne: null
          }
        }
      },
      {
        $lookup: {
          from: "checklistitems",
          //localField: "checklist_id", //this is the _id user from tests
          // foreignField: "checklist_id", //this is the _id from users
          "let": { "checklist_id": "$checklist_id" },
          "pipeline": [
            { "$match": { "$expr": { "$eq": [ "$checklist_id", "$$checklist_id" ] } } },
            { "$lookup": {
              from: "users",
              localField: "members",
              foreignField: "_id",
              as: 'members'
            }}
          ],
          as: "items",
        },
      },
      {
        $project: {
          "users.password": 0
        }
      }
    ]);


    const checklist = result.map((checklistItem) => {
      let numberComplete = 0
      const newItems = checklistItem.items.filter((item) => {
        if (item.completed === 'y' && item.deleted === 'n') {
          numberComplete += 1
        }
        
        return item.deleted === 'n'
      })
      return {
        ...checklistItem,
        items: newItems,
        numberComplete
      }
    })

    return checklist;
  } catch (e) {
    console.log('getTaskChecklists error', e)
    return Promise.reject();
  }
}

module.exports.getTaskDetail = async (query) => {
  try {
    const { taskId } = query
    const [result, attachments, members, labels, checklist] = await Promise.all([
      TaskModel.model.findOne({
        task_id: +taskId
      }),
      this.getTaskAttachments(+taskId),
      this.getTaskMembers(+taskId),
      this.getTaskLabels(+taskId),
      this.getTaskChecklists(+taskId)
    ]);
    return {result, attachments, members, labels, checklist};
  } catch (e) {
    return Promise.reject();
  }
}

module.exports.addTaskMember = async (data, currentUser) => {
  try {
    const {_id, ...rest} = data
    const [result, activity] = await Promise.all([
      TaskUserModel.model.create(rest),
      this.addActivity({
        activity_content: `assign ${data.username || data.fullname || data.email}`,
        task_id: +data.task_id,
        user_id: currentUser.user_id,
        userId: currentUser._id,
        currentUser
      }),
      TaskModel.model.findOneAndUpdate({task_id: +data.task_id}, {
        $push: {
          members: data._id
        }
      }),
    ])
    return {result, activity}
  } catch (e) {
    console.log('error ===>', e)
    return Promise.reject();
  }
}

module.exports.removeTaskMember = async (data, currentUser) => {
  try {
    const { task_id, user_id, _id } = data
    console.log('data =============>', data, currentUser)
    const [ activity ] = await Promise.all([
      this.addActivity({
        activity_content: `remove ${data.username || data.fullname || data.email}`,
        task_id: +data.task_id,
        user_id: currentUser.user_id,
        userId: currentUser._id,
        currentUser
      }),
      TaskUserModel.model.findOneAndRemove({
        task_id: +task_id,
        user_id: +user_id,
      }),
      TaskModel.model.findOneAndUpdate({task_id: +task_id}, {
        $pull: {
          members: _id
        }
      }),
     
    ])
    return {activity}
  } catch (e) {
    console.log('removeTaskMember error', e)
    return Promise.reject();
  }
}

module.exports.removeAllTaskMember = async (data, currentUser) => {
  try {
    const { task_id } = data
    const [ activity ] = await Promise.all([
      this.addActivity({
        activity_content: `remove all members from task`,
        task_id: +data.task_id,
        user_id: currentUser.user_id,
        userId: currentUser._id,
        currentUser
      }),
      TaskUserModel.model.deleteMany({
        task_id: +task_id,
      }),
      TaskModel.model.findOneAndUpdate({task_id: +task_id}, {
        members: []
      }),
     
    ])
    return {activity}
  } catch (e) {
    console.log('removeTaskMember error', e)
    return Promise.reject();
  }
}

module.exports.addTaskLabel = async (data, currentUser) => {
  try {
    const [result, activity] = await Promise.all([
      TaskLabelModel.model.create({
        task_id: data.task_id,
        label_id: data.label_id,
        txhash: data.txhash,
      }),
      this.addActivity({
        activity_content: `set label ${data.label_name}`,
        task_id: +data.task_id,
        user_id: currentUser.user_id,
        userId: currentUser._id,
        currentUser
      })
    ])
    return {result, activity}
  } catch (e) {
    console.log('addTaskLabel error', e)
    return Promise.reject();
  }
}

module.exports.removeTaskLabel = async (data, currentUser) => {
  try {
    const { task_id, label_id } = data
    const [activity] = await Promise.all([
      this.addActivity({
        activity_content: `remove label ${data.label_name}`,
        task_id: +data.task_id,
        user_id: currentUser.user_id,
        userId: currentUser._id,
        currentUser
      }),
      TaskLabelModel.model.findOneAndRemove({
        task_id: +task_id,
        label_id: +label_id,
      }),
      
    ])
    return { activity }
  } catch (e) {
    return Promise.reject();
  }
}

module.exports.submitTaskAttachment = async (data, currentUser) => {
  if (data.attachment_id) {
    return this.editTaskAttachment(data, currentUser)
  } else {
    return this.addTaskAttachment(data, currentUser)
  }
}

module.exports.addTaskAttachment = async (data, currentUser) => {
  try {
    if (data.txhash) {
      const [result, activity] = await Promise.all([
        AttachmentModel.model.create(data),
        this.addActivity({
          activity_content: `add attachment ${data.attachment_link}`,
          task_id: +data.task_id,
          user_id: currentUser.user_id,
          userId: currentUser._id,
          currentUser
        })
      ])
      return {result, activity}
    } else {
      const result = await AttachmentModel.model.create(data)
      return result
    }
    
  } catch (e) {
    return Promise.reject();
  }
}

module.exports.editTaskAttachment = async (data, currentUser) => {
  try {
    const {attachment_id, ...rest} = data
    const [activity] = await Promise.all([
      this.addActivity({
        activity_content: data.isAddNew ? `add attachment ${data.attachment_link}` : `update attachment ${data.attachment_link}`,
        task_id: +data.task_id,
        user_id: currentUser.user_id,
        userId: currentUser._id,
        currentUser
      }),
      AttachmentModel.model.findOneAndUpdate({
        attachment_id: +attachment_id
      }, {
        ...rest,
        user_id: currentUser.user_id
      }),
      
    ])
    return {activity}
  } catch (e) {
    console.log('editTaskAttachment error ===>', e)
    return Promise.reject();
  }
}

module.exports.deleteTaskAttachment = async (data, currentUser) => {
  try {
    const {attachment_id} = data
    const [activity] = await Promise.all([
      data.txhash ? this.addActivity({
        activity_content: `remove attachment ${data.attachment_link}`,
        task_id: +data.task_id,
        user_id: currentUser.user_id,
        userId: currentUser._id,
        currentUser
      }) : Promise.resolve(null),
      AttachmentModel.model.findOneAndUpdate({
        attachment_id: +attachment_id
      }, {
        deleted: 'y',
        txhash: data.txhash
      }),
     
    ])
    return {activity}
  } catch (e) {
    return Promise.reject();
  }
}

module.exports.submitChecklist = async (data, currentUser) => {
  if (data.checklist_id) {
    return this.updateChecklist(data, currentUser)
  } else {
    return this.addChecklist(data, currentUser)
  }
}

module.exports.addChecklist = async (data, currentUser) => {
  try {
    if (data.txhash) {
      const [result, activity] = await Promise.all([
        ChecklistModel.model.create(data),
        this.addActivity({
          activity_content: `add checklist ${data.checklist_title}`,
          task_id: +data.task_id,
          user_id: currentUser.user_id,
          userId: currentUser._id,
          currentUser
        })
      ])
      return {result, activity}
    } else {
      const result = await ChecklistModel.model.create(data)
      return result
    }
  } catch (e) {
    return Promise.reject();
  }
}

module.exports.updateChecklist = async (data, currentUser) => {
  try {
    const {checklist_id, ...rest} = data
    const result = await ChecklistModel.model.findOneAndUpdate({
      checklist_id
    }, rest)
    const activity = await this.addActivity({
      activity_content: data.isAddNew ? `add checklist ${result.checklist_title}` : `update checklist ${result.checklist_title}`,
      task_id: +data.task_id,
      user_id: currentUser.user_id,
      userId: currentUser._id,
      currentUser
    })
    return {result, activity}
  } catch (e) {
    return Promise.reject();
  }
}

module.exports.deleteChecklist = async (data,currentUser) => {
  try {
    const {checklist_id} = data
    const [result, activity] = await Promise.all([
      ChecklistModel.model.findOneAndUpdate({
        checklist_id
      }, {
        deleted: 'y'
      }),
      data.txhash ? this.addActivity({
        activity_content: `remove checklist ${data.checklist_title}`,
        task_id: +data.task_id,
        user_id: currentUser.user_id,
        userId: currentUser._id,
        currentUser
      }) : Promise.resolve(null)
    ])
    return {result, activity}
  } catch (e) {
    return Promise.reject();
  }
}

module.exports.submitChecklistItem = async (data, currentUser) => {
  console.log('test ======>', data, currentUser)
  if (data.item_id) {
    return this.updateChecklistItem(data, currentUser)
  } else {
    return this.addChecklistItem(data, currentUser)
  }
}

module.exports.addChecklistItem = async (data, currentUser) => {
  try {
    if (data.txhash) {
      const [result, activity] = await Promise.all([
        ClItemModel.model.create(data),
        this.addActivity({
          activity_content: `add checklist item ${data.item_name}`,
          task_id: +data.task_id,
          user_id: currentUser.user_id,
          userId: currentUser._id,
          currentUser
        })
      ]) 
      return {result, activity}
    } else {
      const result = await ClItemModel.model.create(data)
      return result
    }
    
  } catch (e) {
    console.log('error', e)
    return Promise.reject();
  }
}

module.exports.updateChecklistItem = async (data, currentUser) => {
  try {
    let activity = null
    const {item_id, ...rest} = data
    if (rest.addMember) {
      const [result] = await Promise.all([
        this.addActivity({
          activity_content: `add member ${rest.addMember.username || rest.addMember.fullname || rest.addMember.email} to checklist item`,
          task_id: +data.task_id,
          user_id: currentUser.user_id,
          userId: currentUser._id,
          currentUser
        }),
        ClItemUserModel.model.create({ item_id, user_id: rest.addMember.user_id, txhash: rest.txhash }),
        ClItemModel.model.findOneAndUpdate({
          item_id
        }, {
          $push: { members: rest.addMember._id },
        }), 
      ])
      activity = result
    } else if (rest.removeMember) {
      const [result] = await Promise.all([
        this.addActivity({
          activity_content: `remove member ${rest.removeMember.username || rest.removeMember.fullname || rest.removeMember.email} from checklist item`,
          task_id: +data.task_id,
          user_id: currentUser.user_id,
          userId: currentUser._id,
          currentUser
        }),
        ClItemUserModel.model.remove({ item_id, user_id: rest.removeMember.user_id }),
        ClItemModel.model.findOneAndUpdate({
          item_id
        }, {
          $pull: { members: rest.removeMember._id },
        }),
        
      ])

      activity = result
    } else {
      const [result] = await Promise.all([
        this.addActivity({
          activity_content: data.isAddNew ? 'add checklist item' : `update checklist item`,
          task_id: +data.task_id,
          user_id: currentUser.user_id,
          userId: currentUser._id,
          currentUser
        }),
        ClItemModel.model.findOneAndUpdate({
          item_id
        }, rest),
      ])

      activity = result
    }
    
    return { activity }
  } catch (e) {
    console.log('error', e)
    return Promise.reject();
  }
}

module.exports.deleteChecklistItem = async (data, currentUser) => {
  try {
    const {item_id} = data
    const [activity] = await Promise.all([
      data.txhash ? this.addActivity({
        activity_content: `remove checklist item ${data.item_name}`,
        task_id: +data.task_id,
        user_id: currentUser.user_id,
        userId: currentUser._id,
        currentUser
      }) : Promise.resolve(null),
      ClItemModel.model.findOneAndUpdate({
        item_id
      }, {
        deleted: 'y',
        txhash: data.txhash || ''
      }),
      ClItemUserModel.model.remove({
        item_id
      }),
    ])
    return {activity}
  } catch (e) {
    console.log('deleteChecklistItem =====>', e)
    return Promise.reject();
  }
}

module.exports.addActivity = async (data) => {
  try {
    const [result, user] = await Promise.all([
      ActivityModel.model.create(data),
      UserModel.model.findById(data.currentUser._id, { password: 0 })
    ])
    return {...result.toObject(), userId: user}
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports.editActivity = async (data) => {
  try {
    const {activity_id, ...rest} = data
    
    const result = await ActivityModel.model.findOneAndUpdate({activity_id}, rest)

    // add notification

    return {...result.toObject(), userId: data.currentUser}
  } catch (e) {
    return Promise.reject();
  }
}

module.exports.addEmoji = async (data, userId) => {
  try {
    const {activity_id, emoji} = data
    const result = await EmojiActivityModel.model.findOneAndUpdate({
      activity_id,
      emoji
    }, {
      activity_id,
      emoji,
      $push: {
        users: userId
      }
    }, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      rawResult: true
    })

    console.log("result.lastErrorObject.updatedExisting", result)

    if (!result.lastErrorObject.updatedExisting) {
      await ActivityModel.model.findOneAndUpdate({
        activity_id
      }, {
        $push: {
          emojies: result.value._id
        }
      })
    }
    
    return result
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports.removeEmoji = async (data, userId) => {
  try {
    const { emoji, activity_id } = data
    const result = await EmojiActivityModel.model.findOneAndUpdate({
      emoji,
      activity_id
    },
      {
        $pull: {
          users: userId
        }
      })
    return true
  } catch (e) {
    return Promise.reject(e);
  }
}

module.exports.removeActivity = async (data) => {
  try {
    const {activity_id} = data
    
    const result = await ActivityModel.model.findOneAndUpdate({activity_id}, {
      deleted: 'y'
    })

    return result
  } catch (e) {
    return Promise.reject();
  }
}

module.exports.getActivity = async (query) => {
  try {
    const {taskId, page, pageSize = 20} = query
    
    const result = await ActivityModel.paginate({
      task_id: +taskId,
      $or: [{
        $and: [{
          txhash: {
            $ne: null
          }
        }, {
          type: 'COMMENT'
        }],
      }, {
        type: 'SYSTEM'
      }]
    }, {
      page,
      limit: pageSize,
      sort: { create_at: -1 },
      populate: [{
        path: 'userId',
        model: 'User'
      }, {
        path: 'emojies',
        model: 'EmojiActivity',
        populate: {
          path: 'users',
          model: 'User',
          select: 'fullname username email user_id'
        } 
      }]
    })

    return result
  } catch (e) {
    return Promise.reject();
  }

}

module.exports.getUserTask = async (query, user_id) => {
  try {
    let taskConditions = []
    if (query.status) {
      taskConditions = [...taskConditions,
        {"$eq": ["$$task.status", query.status]}
      ]
    }

    if (query.statuses) {
      taskConditions = [...taskConditions,
        {"$in": ["$$task.status", query.statuses]}
      ]
    }

    if (query.type === 'complete') {
      const startDate = moment().startOf('day').toDate()
      const endDate = moment().endOf('day').toDate()
      taskConditions = [...taskConditions,
        {"$lt": ["$$task.update_at", endDate]},
        {"$gt": ["$$task.update_at", startDate]}
      ]
    }

    if (query.type === 'in_day') {
      taskConditions = [...taskConditions,
        { $or: [
            {
              $and: [
                {"$lte": ["$$task.start_date", query.startDate]},
                {"$gt": ["$$task.end_date", query.startDate]}
              ]
            },
            {
              $and: [
                {"$gte": ["$$task.start_date", query.startDate]},
                {"$lt": ["$$task.start_date", query.endDate]}
              ]
            }
          ]
        },
        
      ]
    }

    const result = await TaskUserModel.aggregate([
      { $match: {
          user_id: user_id
        },
      },
      {
        $lookup: {
          from: "tasks",
          localField: "task_id", //this is the _id user from tests
          foreignField: "task_id", //this is the _id from users
          as: "tasks",
        },
      },
      {
        "$addFields": {
            "tasks": {
                "$arrayElemAt": [
                    {
                        "$filter": {
                            "input": "$tasks",
                            "as": "task",
                            "cond": {
                                $and: [
                                  {"$eq": [ "$$task.deleted", "n" ]},
                                  ...taskConditions
                                ]
                            }
                        }
                    }, 0
                ]
            }
        }
      },
      {
        $lookup: {
          from: "folders",
          localField: "tasks.folder", //this is the _id user from tests
          foreignField: "_id", //this is the _id from users
          as: "folders",
        },
      },
      { $unwind: '$folders' },
      {
        $lookup: {
          from: "projects",
          localField: "folders.project_id", //this is the _id user from tests
          foreignField: "project_id", //this is the _id from users
          as: "projects",
        },
      },
      { $unwind: '$projects' },
      {
        $lookup: {
          from: "workspaces",
          localField: "projects.workspace_id", //this is the _id user from tests
          foreignField: "workspace_id", //this is the _id from users
          as: "workspaces",
        },
      },
      { $unwind: '$workspaces' },
      {
        $lookup: {
          from: "users",
          localField: "tasks.members", //this is the _id user from tests
          foreignField: "_id", //this is the _id from users
          as: "members",
        },
      },
      {
        $project: {
          "currentUser.password": 0,
          "members.password": 0
        }
      },
    ]);


    return result
  } catch (e) {

    console.log('error ===>',e)
    return Promise.reject();
  }
}