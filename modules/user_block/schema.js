const {
  StringType,
  RefType,
  exportSchema,
  CharType,
} = require('../../helpers/schema');
const { Schema } = require('mongoose');

const UserBlockSchema = new Schema(
  {
    user_id: RefType('User', { required: true }),
    block_id: RefType('Block', { required: true }),
    is_newest: CharType(),
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

module.exports = exportSchema('UserBlock', UserBlockSchema);
