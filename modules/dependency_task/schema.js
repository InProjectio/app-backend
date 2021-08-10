const { StringType, RefType, exportSchema } = require('../../helpers/schema');
const { Schema } = require('mongoose');

const DependencyTaskSchema = new Schema(
  {
    task_parent_id: RefType('Task', { required: true }),
    task_child_id: RefType('Task', { required: true }),
    block_id: StringType(),
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

module.exports = exportSchema('DependencyTask', DependencyTaskSchema);
