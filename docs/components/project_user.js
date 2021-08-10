const faker = require('faker');
const {
  genKey,
  genVarchar,
  genSchemaSkeleton,
  genObjectType,
  genInteger,
  genChar,
  genEnum,
} = require('../helpers');

const requestBody = {
  // Required
  user_id: genKey(),
  project_id: genKey(),
  role: genEnum('string', ['ASSIGNEE', 'VIEWER']).withExample('VIEWER'),
  // Optional
  is_owner: genChar().withExample('y'),
  txhash: genVarchar().withExample(''),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
});

const infoObj = { ...updateInputObj };

const PjUserSchema = new genSchemaSkeleton('ProjectUser');

module.exports = PjUserSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
