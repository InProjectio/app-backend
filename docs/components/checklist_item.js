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
  item_name: genVarchar().withExample(faker.internet.domainName()),
  // Optional
  checklist_id: genKey(),
  order: genFloat(),
  txhash: genVarchar().withExample(''),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
  deleted: genChar(1).withExample('n'),
  end_date: genTimestamp(),
});

const infoObj = {
  ...updateInputObj,
  item_id: genKey(),
  status: genChar().withExample('todo'),
};

const CLItemSchema = new genSchemaSkeleton('ChecklistItem');

module.exports = CLItemSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
