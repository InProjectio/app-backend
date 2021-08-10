const {
  StringType,
  exportSchema,
  NumberType,
} = require('../../helpers/schema');
const { setAutoIncrement } = require('../../helpers/hook');
const { Schema } = require('mongoose');

const schemaName = 'Log';
const autoIncrementId = 'log_id';
const LogSchema = new Schema(
  {
    [autoIncrementId]: NumberType(false, true, true),
    user_id: NumberType(true),
    action: StringType(),
    target: NumberType(),
    txhash: StringType(),
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

setAutoIncrement(LogSchema, schemaName, autoIncrementId);

module.exports = exportSchema(schemaName, LogSchema, {
  autoIncrement: autoIncrementId,
});
