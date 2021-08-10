const {
  StringType,
  EnumType,
  exportSchema,
  NumberType,
} = require('../../helpers/schema');
const { Schema } = require('mongoose');

const schemaName = 'ProjectUser';
const ProjectUserSchema = new Schema(
  {
    project_id: NumberType(true),
    user_id: NumberType(true),
    role: EnumType(String, ['ASSIGNEE', 'VIEWER'], { required: true }),
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

module.exports = exportSchema(schemaName, ProjectUserSchema);
