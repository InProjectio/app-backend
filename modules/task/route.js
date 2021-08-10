const TaskRoute = require("express").Router();
const TaskController = require("./controller");
const { useToken } = require("../../middlewares/token");
const { withValidation } = require("../../middlewares/validation");
const validator = require("./validator");

TaskRoute.use(useToken);

// GET
TaskRoute.get("/todo-task", TaskController.getTodoTask);
TaskRoute.get("/completed-task-in-day", TaskController.getCompletedTaskInDay);
TaskRoute.get("/task-in-day", TaskController.getTaskInDay);
TaskRoute.get("/detail", TaskController.getTaskDetail);
TaskRoute.get("/activities", TaskController.getTaskActivities);
TaskRoute.get("/find-tasks", TaskController.findTasks);
TaskRoute.get("/find-tasks-calendar", TaskController.findTasksCalendar);
TaskRoute.get("/find-tasks-board", TaskController.findTasksBoard);
TaskRoute.get("/find-tasks-board-loadmore", TaskController.findTasksBoardLoadmore);
TaskRoute.get("/find-tasks-assignee", TaskController.findTasksByAssignee);
TaskRoute.get("/list", TaskController.getTaskList);
TaskRoute.get("/overdue", TaskController.getUserTasksOverdue);
TaskRoute.get("/txhash/:txHash", TaskController.getTaskByTxHash);
TaskRoute.get("/:id/is-deleted", TaskController.checkDeletedOrNot);
TaskRoute.get("/:id/txhash", TaskController.getTxHashById);
TaskRoute.get("/:id/folder-id", TaskController.getFolderIdById);
TaskRoute.get("/:id", TaskController.getTaskById);
// POST
TaskRoute.post("/clear-task-overdue", TaskController.clearTask);
TaskRoute.post("/add-member", TaskController.addTaskMember);
TaskRoute.post("/remove-member", TaskController.removeTaskMember);
TaskRoute.post("/remove-all-members", TaskController.removeAllTaskMember);

TaskRoute.post("/submit-attachment", TaskController.submitAttachment);
TaskRoute.post("/remove-attachment", TaskController.removeAttachment);

TaskRoute.post("/submit-checklist", TaskController.submitChecklist);
TaskRoute.post("/remove-checklist", TaskController.removeChecklist);

TaskRoute.post("/submit-checklist-item", TaskController.submitChecklistItem);
TaskRoute.post("/remove-checklist-item", TaskController.removeChecklistItem);

TaskRoute.post("/add-label", TaskController.addTaskLabel);
TaskRoute.post("/remove-label", TaskController.removeTaskLabel);

TaskRoute.post("/add-activity", TaskController.addActivity);
TaskRoute.put("/edit-activity", TaskController.editActivity);
TaskRoute.delete("/remove-activity", TaskController.removeActivity);
TaskRoute.post("/add-emoji", TaskController.addEmoji);
TaskRoute.post("/remove-emoji", TaskController.removeEmoji);

TaskRoute.post(
  "/",
  validator.taskCreation(),
  withValidation(TaskController.createNewTask)
);

// PUT
TaskRoute.put(
  "/:id",
  validator.taskUpdating(),
  TaskController.updateById
);

// DELETE
TaskRoute.delete("/:id", TaskController.deleteById);

module.exports = TaskRoute;
