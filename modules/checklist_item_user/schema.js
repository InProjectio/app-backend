const {
  StringType,
  EnumType,
  exportSchema,
  NumberType,
} = require('../../helpers/schema');
const { Schema } = require('mongoose');

const schemaName = 'ChecklistItemUser';
const ChecklistItemUserSchema = new Schema(
  {
    item_id: NumberType(true),
    user_id: NumberType(true),
    txhash: StringType(),
    is_assigner: EnumType(String, ['n', 'y'], { default: 'y' }),
    is_assignee: EnumType(String, ['n', 'y'], { default: 'y' }),
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

module.exports = exportSchema(schemaName, ChecklistItemUserSchema);
