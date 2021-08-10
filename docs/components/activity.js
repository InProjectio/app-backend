const faker = require('faker');
const {
  genKey,
  genVarchar,
  genSchemaSkeleton,
  genChar,
  genObjectType,
  genInteger,
} = require('../helpers');

const requestBody = {
  // Required
  activity_content: genVarchar().withExample(faker.internet.domainName()),
  // Optional
  user_id: genInteger().withExample(1),
  task_id: genInteger().withExample(1),
  txhash: genVarchar().withExample(''),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
  deleted: genChar(1).withExample('n'),
});

const infoObj = { ...updateInputObj, activity_id: genKey() };

const ActivitySchema = new genSchemaSkeleton('Activity');

module.exports = ActivitySchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
