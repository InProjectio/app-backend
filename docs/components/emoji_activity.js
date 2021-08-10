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
  emoji: genVarchar().withExample(faker.lorem.word(1)),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
});

const infoObj = genObjectType({
  ...requestBody,
});

const EmojiActivitySchema = new genSchemaSkeleton('EmojiActivity');

module.exports = EmojiActivitySchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
