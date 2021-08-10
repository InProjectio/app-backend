const faker = require('faker');
const {
  genKey,
  genVarchar,
  genSchemaSkeleton,
  genObjectType,
  genInteger,
  genEnum,
} = require('../helpers');

const requestBody = {
  // Required
  txhash: genVarchar(),
  // Optional
  previous_txhash: genVarchar(),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
  is_newest: genEnum('string', ['y', 'n']),
});

const infoObj = { ...updateInputObj };

const TxhashSchema = new genSchemaSkeleton('Txhash');

module.exports = TxhashSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
