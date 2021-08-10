const {
  StringType,
  EnumType,
  exportSchema,
  NumberType,
} = require("../../helpers/schema");
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const { setAutoIncrement } = require("../../helpers/hook");
const { Schema } = require("mongoose");
const moment = require('moment')

const schemaName = "Task";
const autoIncrementId = "task_id";
const TaskSchema = new Schema(
  {
    [autoIncrementId]: NumberType(false, true, true),
    folder_id: NumberType(true),
    task_name: StringType(true),
    dependency_id: NumberType(),
    order: NumberType(),
    description: StringType(),
    start_date: NumberType(),
    end_date: NumberType(),
    notificationTime: NumberType(),
    estimate: NumberType(),
    duedate_reminder: NumberType(),
    status: EnumType(String, ["todo", "progress", "ready", "complete"], {
      default: "todo",
    }),
    budget: NumberType(),
    spend: NumberType(),
    cover_img_url: StringType(),
    txhash: StringType(),
    deleted: EnumType(String, ["n", "y"], { default: "n" }),
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    folder: {
      type: Schema.Types.ObjectId,
      ref: "Folder",
    },
  },
  {
    timestamps: {
      createdAt: "create_at",
      updatedAt: "update_at",
    },
  }
);

setAutoIncrement(TaskSchema, schemaName, autoIncrementId);

TaskSchema.plugin(aggregatePaginate);

TaskSchema.index({
  task_name: "text",
});

TaskSchema.pre('save', function(next) {
  this.notificationTime = (this.duedate_reminder && +this.duedate_reminder > 0)
    ? moment.unix(this.end_date).add(-(+this.duedate_reminder), 'minutes').unix()
    : moment.unix(this.end_date).unix()
  next();
});


module.exports = exportSchema(schemaName, TaskSchema, {
  autoIncrement: autoIncrementId,
});
