const faker = require('faker');
const {
  genKey,
  genVarchar,
  genSchemaSkeleton,
  genChar,
  genObjectType,
} = require('../helpers');

const requestBody = {
  // Required
  checklist_title: genVarchar().withExample(faker.internet.domainName()),
  // Optional
  show_checked_item: genChar(1).withExample('y'),
  task_id: genKey(),
  txhash: genVarchar().withExample(''),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
  deleted: genChar(1).withExample('n'),
});

const infoObj = { ...updateInputObj, checklist_id: genKey() };

const ChecklistSchema = new genSchemaSkeleton('Checklist');

module.exports = ChecklistSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
