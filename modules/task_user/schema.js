const {
  StringType,
  NumberType,
  CharType,
  EnumType,
  exportSchema,
} = require('../../helpers/schema');
const { Schema } = require('mongoose');

const TaskUserSchema = new Schema(
  {
    task_id: NumberType(true),
    user_id: NumberType(true),
    is_owner: EnumType(String, ['y', 'n'], { default: 'y' }),
    is_assignee: EnumType(String, ['y', 'n'], { default: 'y' }),
    watch: EnumType(String, ['y', 'n'], { default: 'y' }),
    txhash: StringType(),
    cleared: EnumType(String, ['y', 'n'], { default: 'n' })
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

module.exports = exportSchema('TaskUser', TaskUserSchema);
