const {
  StringType,
  NumberType,
  EnumType,
  exportSchema,
} = require('../../helpers/schema');
const { Schema } = require('mongoose');

const WSUserSchema = new Schema(
  {
    workspace_id: NumberType(true),
    user_id: NumberType(true),
    role: EnumType(String, ['ASSIGNEE', 'VIEWER']),
    is_owner: EnumType(String, ['y', 'n'], { default: 'n' }),
    is_accepted: EnumType(String, ['y', 'n'], { default: 'n' }),
    txhash: StringType(),
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

module.exports = exportSchema('WorkspaceUser', WSUserSchema);
