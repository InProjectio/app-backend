const faker = require('faker');
const {
  genKey,
  genSchemaSkeleton,
  genObjectType,
  genVarchar,
  genTimestamp,
} = require('../helpers');

const requestBody = {
  time: genTimestamp(),
  job: genKey(),
  type: genVarchar().withExample(faker.name.title()),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
});

const infoObj = genObjectType({
  ...requestBody,
});

const TimelineSchema = new genSchemaSkeleton('Timeline');

module.exports = TimelineSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
