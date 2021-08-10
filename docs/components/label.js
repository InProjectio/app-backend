const faker = require('faker');
const {
  genKey,
  genVarchar,
  genSchemaSkeleton,
  genObjectType,
} = require('../helpers');

const requestBody = {
  // Required
  label_name: genVarchar().withExample(faker.internet.domainName()),
  // Optional
  label_color: genVarchar().withExample('red'),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
});

const infoObj = { ...updateInputObj, label_id: genKey() };

const LabelSchema = new genSchemaSkeleton('Label');

module.exports = LabelSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
