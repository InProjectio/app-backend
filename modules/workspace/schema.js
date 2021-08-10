const {
  StringType,
  EnumType,
  exportSchema,
  NumberType,
  AutoIncrementIdType,
} = require('../../helpers/schema');
const { setAutoIncrement } = require('../../helpers/hook');
const { Schema } = require('mongoose');

const schemaName = 'Workspace';
const autoIncrementId = 'workspace_id';
const WorkspaceSchema = new Schema(
  {
    [autoIncrementId]: AutoIncrementIdType(),
    workspace_name: StringType(true),
    thumbnail_url: StringType(),
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

setAutoIncrement(WorkspaceSchema, schemaName, autoIncrementId);

module.exports = exportSchema(schemaName, WorkspaceSchema, {
  autoIncrement: autoIncrementId,
});
