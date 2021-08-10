const {
  StringType,
  EnumType,
  exportSchema,
  NumberType,
} = require("../../helpers/schema");
const { setAutoIncrement } = require("../../helpers/hook");
const { Schema } = require("mongoose");

const schemaName = "ChecklistItem";
const autoIncrementId = "item_id";
const ChecklistItemSchema = new Schema(
  {
    [autoIncrementId]: NumberType(false, true, true),
    item_name: StringType(true),
    checklist_id: NumberType(true, false, true),
    order: NumberType(false, false, true),
    txhash: StringType(),
    completed: EnumType(String, ["y", "n"], {
      default: "n",
    }),
    deleted: EnumType(String, ["n", "y"], { default: "n" }),
    end_date: NumberType(),
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: {
      createdAt: "create_at",
      updatedAt: "update_at",
    },
  }
);

setAutoIncrement(ChecklistItemSchema, schemaName, autoIncrementId);

module.exports = exportSchema(schemaName, ChecklistItemSchema, {
  autoIncrement: autoIncrementId,
});
