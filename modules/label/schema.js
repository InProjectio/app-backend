const {
  StringType,
  exportSchema,
  NumberType,
  EnumType
} = require("../../helpers/schema");
const { setAutoIncrement } = require("../../helpers/hook");
const { Schema } = require("mongoose");

const schemaName = "Label";
const autoIncrementId = "label_id";
const LabelSchema = new Schema(
  {
    [autoIncrementId]: NumberType(false, true, true),
    label_name: StringType(true, false, true),
    label_color: StringType(true, false, true),
    txhash: StringType(),
    deleted: EnumType(String, ['n', 'y'], { default: 'n' }),
    user_id: NumberType(true),
    workspace_id: NumberType(true),
  },
  {
    timestamps: {
      createdAt: "create_at",
      updatedAt: "update_at",
    },
  }
);

LabelSchema.index({
  label_name: 1,
  label_color: 1,
});

setAutoIncrement(LabelSchema, schemaName, autoIncrementId);

module.exports = exportSchema(schemaName, LabelSchema, {
  autoIncrement: autoIncrementId,
});
