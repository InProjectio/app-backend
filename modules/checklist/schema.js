const {
  StringType,
  EnumType,
  exportSchema,
  NumberType,
} = require("../../helpers/schema");
const { setAutoIncrement } = require("../../helpers/hook");
const { Schema } = require("mongoose");

const schemaName = "Checklist";
const autoIncrementId = "checklist_id";
const ChecklistSchema = new Schema(
  {
    [autoIncrementId]: NumberType(false, true, true),
    checklist_title: StringType(true),
    task_id: NumberType(),
    txhash: StringType(),
    show_checked_item: EnumType(String, ["n", "y"], { default: "y" }),
    deleted: EnumType(String, ["n", "y"], { default: "n" }),
  },
  {
    timestamps: {
      createdAt: "create_at",
      updatedAt: "update_at",
    },
  }
);


setAutoIncrement(ChecklistSchema, schemaName, autoIncrementId);

module.exports = exportSchema(schemaName, ChecklistSchema, {
  autoIncrement: autoIncrementId,
});
