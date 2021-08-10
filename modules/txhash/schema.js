const {
  StringType,
  exportSchema,
  NumberType,
  EnumType,
} = require('../../helpers/schema');
const { Schema } = require('mongoose');

const schemaName = 'Txhash';
const TxhashSchema = new Schema(
  {
    txhash: StringType(true),
    is_newest: EnumType(String, ['y', 'n'], { default: 'y' }),
    previous_txhash: StringType(),
  },
  {
    timestamps: {
      createdAt: 'create_at',
      updatedAt: 'update_at',
    },
  }
);

module.exports = exportSchema(schemaName, TxhashSchema);
