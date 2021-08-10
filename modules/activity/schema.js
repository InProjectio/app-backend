const {
  StringType,
  EnumType,
  exportSchema,
  NumberType,
} = require('../../helpers/schema');
const { setAutoIncrement } = require('../../helpers/hook');
const { Schema } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const schemaName = 'Activity';
const autoIncrementId = 'activity_id';
const ActivitySchema = new Schema(
  {
    [autoIncrementId]: NumberType(false, true, true),
    activity_content: StringType(true),
    task_id: NumberType(),
    user_id: NumberType(),
    txhash: StringType(),
    deleted: EnumType(String, ['n', 'y'], { default: 'n' }),
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    type: EnumType(String, ['SYSTEM', 'COMMENT'], { default: 'SYSTEM' }),
    emojies: [
      {
        type: Schema.Types.ObjectId,
        ref: "EmojiActivity",
      },
    ],
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

ActivitySchema.plugin(mongoosePaginate)

setAutoIncrement(ActivitySchema, schemaName, autoIncrementId);

module.exports = exportSchema(schemaName, ActivitySchema, {
  autoIncrement: autoIncrementId,
});
