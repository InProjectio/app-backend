const { StringType, RefType, exportSchema } = require('../../helpers/schema');
const { Schema } = require('mongoose');

const BlockSchema = new Schema(
  {
    block_data: StringType(),
    block_parent_id: StringType(),
    block_child_id: StringType(),
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

module.exports = exportSchema('Block', BlockSchema);
