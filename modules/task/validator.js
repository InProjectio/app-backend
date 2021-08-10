const { check } = require("express-validator");

module.exports.taskCreation = () => [
  check("folder_id", "Folder ID is required").isNumeric().not().isEmpty(),
  check("task_name", "Task name is required").isString().not().isEmpty(),
  check("order").isInt().optional(),
  check("description").isString().optional(),
  check("start_date").isNumeric().optional(),
  check("end_date").isNumeric().optional(),
  check("estimate").isNumeric().optional(),
  check("cover_img_url").isString().optional(),
  check("labels", "Invalid labels").isArray().optional(),
  check("labels.*.id").isInt().optional(),
  check("labels.*.name", "Label name is required").isString(),
  check("labels.*.color", "Label color is required").isString(),
  check("members", "Invalid members").isArray().optional(),
  check("checklist", "Invalid checklist").isArray().optional(),
  check("checklist.title", "Checklist title is required").isString().optional(),
  check("checklist.items", "Invalid items").isArray().optional(),
  check(
    "checklist.items.*.name",
    "Checklist item name is required !"
  ).isString(),
  check("checklist.items.*.order", "Checklist item order is invalid")
    .isInt()
    .optional(),
  check("checklist.items.*.status", "Checklist item status is invalid")
    .isString()
    .optional(),
  check("checklist.items.*.endDate", "Checklist item end date is invalid")
    .isString()
    .optional(),
  check("attachments", "Invalid attachments").isArray().optional(),
  check("attachments.*.name", "Attachments name is required").isString(),
  check("attachments.*.link", "Attachments link is required").isString(),
  check(
    "attachments.*.location",
    "Attachments location is required"
  ).isString(),
];

module.exports.taskUpdating = () => [
  check("order").isInt().optional(),
  check("description").isString().optional(),
  check("start_date").isString().optional(),
  check("end_date").isString().optional(),
  check("estimate").isNumeric().optional(),
  // check("duedate_reminder").isNumeric().optional(),
  check("budget").isNumeric().optional(),
  check("spend").isNumeric().optional(),
  check("cover_img_url").isString().optional(),
  check("labels", "Invalid labels").isArray().optional(),
  check("labels.*.id").isInt().optional(),
  check("labels.*.name", "Label name is required").isString(),
  check("labels.*.color", "Label color is required").isString(),
  check("members", "Invalid members").isArray().optional(),
  check("members.*", "Member item is invalid").isInt(),
  check("checklist", "Invalid checklist").isObject().optional(),
  check("checklist.id", "Checklist id is invalid !").isInt().optional(),
  check("checklist.title", "Checklist title is required").isString().optional(),
  check("checklist.items", "Invalid items").isArray().optional(),
  check("checklist.items.*.id", "Checklist item id is invalid !")
    .isInt()
    .optional(),
  check(
    "checklist.items.*.name",
    "Checklist item name is required !"
  ).isString(),
  check("checklist.items.*.order", "Checklist item order is invalid")
    .isInt()
    .optional(),
  check("checklist.items.*.status", "Checklist item status is invalid")
    .isString()
    .optional(),
  check("checklist.items.*.endDate", "Checklist item end date is invalid")
    .isString()
    .optional(),
  check("attachments", "Invalid attachments").isArray().optional(),
  check("attachments.*.id", "Attachments id is invalid").isInt().optional(),
  check("attachments.*.name", "Attachments name is required").isString(),
  check("attachments.*.link", "Attachments link is required").isString(),
  check(
    "attachments.*.location",
    "Attachments location is required"
  ).isString(),
];
