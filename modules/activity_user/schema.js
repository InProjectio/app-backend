const { StringType, RefType, exportSchema } = require('../../helpers/schema');
const { Schema } = require('mongoose');

const ActivityUserSchema = new Schema(
  {
    activity_id: RefType('Activity'),
    user_id: RefType('User'),
    content: StringType(true),
    block_id: StringType(),
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

module.exports = exportSchema('ActivityUser', ActivityUserSchema);
