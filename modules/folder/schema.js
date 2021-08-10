const {
  StringType,
  EnumType,
  exportSchema,
  NumberType,
} = require('../../helpers/schema');
const { setAutoIncrement } = require('../../helpers/hook');
const { Schema } = require('mongoose');

const schemaName = 'Folder';
const autoIncrementId = 'folder_id';
const FolderSchema = new Schema(
  {
    [autoIncrementId]: NumberType(false, true, true),
    folder_name: StringType(true),
    project_id: NumberType(),
    txhash: StringType(),
    deleted: EnumType(String, ['n', 'y'], { default: 'n' }),
    visible: EnumType(String, ['n', 'y'], { default: 'y' }),
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

setAutoIncrement(FolderSchema, schemaName, autoIncrementId);

module.exports = exportSchema(schemaName, FolderSchema, {
  autoIncrement: autoIncrementId,
});
