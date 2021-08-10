const faker = require('faker');
const {
  genKey,
  genVarchar,
  genSchemaSkeleton,
  genObjectType,
  genEnum,
  genObjectOfArrayOfObject,
  genChar,
} = require('../helpers');

const requestBody = {
  // Required
  username: genVarchar().withExample(faker.internet.userName()),
  email: genVarchar().withExample(faker.internet.email()),
  password: genVarchar().withExample(faker.internet.password()),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
  fullname: genVarchar().withExample(''),
  intro: genVarchar().withExample(''),
  role: genEnum('string', ['inner', 'outsource'], { default: 'inner' }),
  public_key: genVarchar().withExample(''),
  avatar_url: genVarchar().withExample(''),
});

const infoObj = { ...updateInputObj, user_id: genKey() };

const userWithAcceptStatus = {
  ...updateInputObj,
  role: genVarchar(),
  is_owner: genChar(),
  is_accepted: genChar(),
};

const UserSchema = new genSchemaSkeleton('User');

module.exports = UserSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .setCustomSchema('WithAcceptStatus', userWithAcceptStatus)
  .done();
