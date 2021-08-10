const faker = require('faker');
const {
  genKey,
  genSchemaSkeleton,
  genObjectType,
  genVarchar,
} = require('../helpers');

const requestBody = {
  activity_id: genKey(),
  user_id: genKey(),
  content: genVarchar().withExample(faker.lorem.sentences(2)),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
});

const infoObj = genObjectType({
  ...requestBody,
});

const ActivityUserSchema = new genSchemaSkeleton('ActivityUser');

module.exports = ActivityUserSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
