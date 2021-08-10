const {
  StringType,
  exportSchema,
  NumberType,
  EnumType
} = require("../../helpers/schema");
const { setAutoIncrement } = require("../../helpers/hook");
const { Schema } = require("mongoose");

var paginate = require("mongoose-paginate-v2");

const schemaName = "Transaction";
const autoIncrementId = "transaction_id";
const TransactionSchema = new Schema(
  {
    [autoIncrementId]: NumberType(false, true, true),
    txhash: StringType(true),
    user_id: NumberType(true),
    from: StringType(true),
    to: StringType(false),
    summary: StringType(true),
    status: EnumType(Number, [0, 1], {default: 0}),
    block_hash: StringType(false),
    block_number: NumberType(false),
    type: EnumType(String, ['ADD', 'UPDATE', 'DELETE'], {default: 'ADD'}),
  },
  {
    timestamps: {
      createdAt: "create_at",
      updatedAt: "update_at",
    },
  }
);

TransactionSchema.plugin(paginate);


setAutoIncrement(TransactionSchema, schemaName, autoIncrementId);

module.exports = exportSchema(schemaName, TransactionSchema, {
  autoIncrement: autoIncrementId,
});
