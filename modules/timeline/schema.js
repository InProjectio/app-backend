const {
  StringType,
  RefType,
  exportSchema,
  DateType,
} = require('../../helpers/schema');
const { Schema } = require('mongoose');

const TimelineSchema = new Schema(
  {
    time: DateType(),
    job: RefType('ChecklistItem'),
    type: StringType(),
    block_id: StringType(),
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

module.exports = exportSchema('Timeline', TimelineSchema);
