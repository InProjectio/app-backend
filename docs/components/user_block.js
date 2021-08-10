const faker = require('faker');
const {
  genKey,
  genSchemaSkeleton,
  genObjectType,
  genChar,
} = require('../helpers');

const requestBody = {
  user_id: genKey(),
  block_id: genKey(),
  is_newest: genChar().withExample('Y'),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
});

const infoObj = genObjectType({
  ...requestBody,
});

const UserBlockSchema = new genSchemaSkeleton('UserBlock');

module.exports = UserBlockSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
