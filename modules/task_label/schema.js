const {
  StringType,
  exportSchema,
  NumberType,
} = require('../../helpers/schema');
const { Schema } = require('mongoose');

const TaskLabelSchema = new Schema(
  {
    task_id: NumberType(),
    label_id: NumberType(),
    block_id: StringType(),
    txhash: StringType(),
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

module.exports = exportSchema('TaskLabel', TaskLabelSchema);
