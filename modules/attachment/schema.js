const {
  StringType,
  EnumType,
  exportSchema,
  NumberType,
} = require('../../helpers/schema');
const { setAutoIncrement } = require('../../helpers/hook');
const { Schema } = require('mongoose');

const schemaName = 'Attachment';
const autoIncrementId = 'attachment_id';
const AttachmentSchema = new Schema(
  {
    [autoIncrementId]: NumberType(false, true, true),
    attachment_location: EnumType(String, ['LINK', 'UPLOAD'], { default: 'nLINK' }),
    task_id: NumberType(),
    user_id: NumberType(),
    activity_id: NumberType(),
    attachment_name: StringType(),
    attachment_link: StringType(),
    txhash: StringType(),
    deleted: EnumType(String, ['n', 'y'], { default: 'n' }),
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

setAutoIncrement(AttachmentSchema, schemaName, autoIncrementId);

module.exports = exportSchema(schemaName, AttachmentSchema, {
  autoIncrement: autoIncrementId,
});
