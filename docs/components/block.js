const faker = require('faker');
const {
  genKey,
  genSchemaSkeleton,
  genObjectType,
  genVarchar,
} = require('../helpers');

const requestBody = {
  block_data: genVarchar().withExample(faker.lorem.sentences(2)),
  block_parent_id: genKey(),
  block_child_id: genKey(),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
});

const infoObj = genObjectType({
  ...requestBody,
});

const BlockSchema = new genSchemaSkeleton('Block');

module.exports = BlockSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
