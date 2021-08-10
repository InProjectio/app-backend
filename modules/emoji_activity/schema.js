const {
  StringType,
  exportSchema,
  NumberType
} = require('../../helpers/schema');
const { Schema } = require('mongoose');

const EmojiActivitySchema = new Schema(
  {
    activity_id: NumberType(true),
    emoji: StringType(),
    block_id: StringType(),
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
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

module.exports = exportSchema('EmojiActivity', EmojiActivitySchema);
