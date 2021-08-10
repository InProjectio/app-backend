const TaskModel = require("./model");
const { cvtToNumber } = require("../../helpers/transform_data");
const {
  findTasks,
  findTasksCalendar,
  createTask,
  updateTask,
  getTaskDetail,
  getActivity,
  addTaskMember,
  removeTaskMember,
  addTaskLabel,
  removeTaskLabel,
  deleteTaskAttachment,
  submitTaskAttachment,
  deleteChecklist,
  submitChecklist,
  findTasksBoard,
  findTasksBoardLoadmore,
  findTasksByAssignee,
  deleteChecklistItem,
  submitChecklistItem,
  addActivity,
  editActivity,
  removeActivity,
  findUserTasksOverdule,
  clearUserTaskOverdue,
  getUserTask,
  removeAllTaskMember,
  addEmoji,
  removeEmoji
} = require("../../combine_operations/task");
const moment = require('moment')

// Retrieve data

module.exports.getTaskList = async (req, res, next) => {
  try {
    const result = await TaskModel.list();
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.addTaskMember = async (req, res, next) => {
  try {
    const result = await addTaskMember(req.body, req.user);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.removeTaskMember = async (req, res, next) => {
  try {
    const result = await removeTaskMember(req.body, req.user)
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.addTaskLabel = async (req, res, next) => {
  try {
    const result = await addTaskLabel(req.body, req.user);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.removeTaskLabel = async (req, res, next) => {
  try {
    const result = await removeTaskLabel(req.body, req.user)
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.addActivity = async (req, res, next) => {
  try {
    const data = req.body
    const result = await addActivity({
      currentUser: req.user,
      task_id: data.task_id,
      activity_content: data.activity_content,
      user_id: req.user.user_id,
      userId: req.user._id,
      type: 'COMMENT'
    });
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.editActivity = async (req, res, next) => {
  try {
    const data = req.body
    const result = await editActivity({
      activity_id: data.activity_id,
      currentUser: req.user,
      task_id: data.task_id,
      activity_content: data.activity_content,
      user_id: req.user.user_id,
      txhash: data.txhash,
      type: 'COMMENT'
    })
    next(result);
  } catch (error) {
    next(error);
  }
};


module.exports.removeActivity = async (req, res, next) => {
  try {
    const result = await removeActivity({activity_id: req.body.activity_id})
    next(result);
  } catch (error) {
    next(error);
  }
};


module.exports.getTaskActivities = async (req, res, next) => {
  try {
    const result = await getActivity(req.query)
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTaskById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await TaskModel.detail(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTaskByTxHash = async (req, res, next) => {
  try {
    const txHash = req.params.txHash;
    const result = await TaskModel.getDetailByTxHash(txHash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTxHashById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await TaskModel.getTxHashById(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getFolderIdById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await TaskModel.getFolderIdById(id);
    next(cvtToNumber(result));
  } catch (error) {
    next(error);
  }
};

module.exports.submitAttachment = async (req, res, next) => {
  try {
    const result = await submitTaskAttachment(req.body, req.user);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.removeAttachment = async (req, res, next) => {
  try {
    const result = await deleteTaskAttachment(req.body, req.user);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.submitChecklist = async (req, res, next) => {
  try {
    const result = await submitChecklist(req.body, req.user);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.removeChecklist = async (req, res, next) => {
  try {
    const result = await deleteChecklist(req.body, req.user);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.submitChecklistItem = async (req, res, next) => {
  try {
    const result = await submitChecklistItem(req.body, req.user);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.removeChecklistItem = async (req, res, next) => {
  try {
    const result = await deleteChecklistItem(req.body, req.user);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.checkDeletedOrNot = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await TaskModel.checkIsDeletedOrNot(id);
    next(result);
  } catch (error) {
    next(error);
  }
};

// Create data
module.exports.createNewTask = async (req, res, next) => {
  const queryBody = req.body;
  const currentUserId = req.user.user_id;
  const result = await createTask(queryBody, currentUserId);
  next(result);
};

// Update data
module.exports.updateById = async (req, res, next) => {
  const id = req.params.id;
  const queryBody = req.body;
  const currentUser = req.user;
  const result = await updateTask(id, queryBody, currentUser);
  next(result);
};

module.exports.deleteById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await TaskModel.deleteById(id, req.body.txhash);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.findTasks = async (req, res, next) => {
  try {
    const query = req.query;
    const result = await findTasks(query, req.user.user_id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.findTasksBoard = async (req, res, next) => {
  try {
    const query = req.query;
    const result = await findTasksBoard(query, req.user.user_id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.findTasksBoardLoadmore = async (req, res, next) => {
  try {
    const query = req.query;
    const result = await findTasksBoardLoadmore(query, req.user.user_id);
    next(result);
  } catch (error) {
    next(error);
  }
};


module.exports.findTasksByAssignee = async (req, res, next) => {
  try {
    const query = req.query;
    const result = await findTasksByAssignee(query, req.user.user_id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTaskDetail = async (req, res, next) => {
  try {
    const query = req.query;
    const result = await getTaskDetail(query);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.findTasksCalendar = async (req, res, next) => {
  try {
    const query = req.query;
    const result = await findTasksCalendar(query, req.user.user_id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getUserTasksOverdue = async (req, res, next) => {
  try {
    const query = req.query;
    const result = await findUserTasksOverdule(query, req.user.user_id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.clearTask = async (req, res, next) => {
  try {
    const {data} = req.body;
    const result = await clearUserTaskOverdue(data, req.user.user_id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getTodoTask = async (req, res, next) => {
  try {
    const { textSearch } = req.query;
    const result = await getUserTask({
      statuses: ['todo', 'progress', 'ready'],
      textSearch
    }, req.user.user_id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.getCompletedTaskInDay = async (req, res, next) => {
  try {
    const query = {
      statuses: ['complete'],
      type: 'complete'
    }
    const result = await getUserTask(query, req.user.user_id);
    next(result);
  } catch (error) {
    next(error);
  }
};


module.exports.getTaskInDay = async (req, res, next) => {
  try {
    const query = req.query
    const params = {
      type: 'in_day',
      startDate: +query.date
        ? moment.unix(query.date).startOf('day').unix()
        : moment().startOf('day').unix(),
      endDate: +query.date
        ? moment.unix(query.date).endOf('day').unix()
        : moment().endOf('day').unix()
    }
    const result = await getUserTask(params, req.user.user_id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.removeAllTaskMember = async (req, res, next) => {
  try {
    const result = await removeAllTaskMember(req.body, req.user.user_id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.addEmoji = async (req, res, next) => {
  try {
    const result = await addEmoji(req.body, req.user._id);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports.removeEmoji = async (req, res, next) => {
  try {
    const result = await removeEmoji(req.body, req.user._id);
    next(result);
  } catch (error) {
    next(error);
  }
};