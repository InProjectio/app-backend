const {
  StringType,
  EnumType,
  exportSchema,
  NumberType,
  AutoIncrementIdType,
} = require('../../helpers/schema');
const { setAutoIncrement } = require('../../helpers/hook');
const { Schema } = require('mongoose');

const schemaName = 'Project';
const autoIncrementId = 'project_id';
const ProjectSchema = new Schema(
  {
    [autoIncrementId]: AutoIncrementIdType(),
    workspace_id: NumberType(true),
    project_name: StringType(true),
    txhash: StringType(),
    visible: EnumType(String, ['n', 'y'], { default: 'n' }),
    deleted: EnumType(String, ['n', 'y'], { default: 'n' }),
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

setAutoIncrement(ProjectSchema, schemaName, autoIncrementId);

module.exports = exportSchema(schemaName, ProjectSchema, {
  autoIncrement: autoIncrementId,
});
