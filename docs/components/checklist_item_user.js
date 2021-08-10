const faker = require('faker');
const {
  genKey,
  genVarchar,
  genSchemaSkeleton,
  genChar,
  genObjectType,
  genFloat,
  genTimestamp,
} = require('../helpers');

const requestBody = {
  // Required
  item_id: genKey(),
  user_id: genKey(),
  // Optional
  is_assigner: genChar('y'),
  is_assignee: genChar('n'),
  txhash: genVarchar().withExample(''),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
});

const infoObj = {
  ...updateInputObj,
};

const CLItemUserSchema = new genSchemaSkeleton('ChecklistItemUser');

module.exports = CLItemUserSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
