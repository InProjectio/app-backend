const faker = require('faker');
const {
  genKey,
  genVarchar,
  genSchemaSkeleton,
  genObjectType,
  genInteger,
} = require('../helpers');

const requestBody = {
  // Required
  user_id: genKey(),
  // Optional
  action: genVarchar().withExample('creating'),
  target: genInteger(),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
});

const infoObj = { ...updateInputObj, log_id: genKey() };

const LogSchema = new genSchemaSkeleton('Log');

module.exports = LogSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
