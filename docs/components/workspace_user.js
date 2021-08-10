const faker = require('faker');
const {
  genKey,
  genVarchar,
  genSchemaSkeleton,
  genChar,
  genObjectType,
  genEnum,
} = require('../helpers');

const requestBody = {
  // Required
  workspace_id: genKey(),
  user_id: genKey(),
  role: genEnum('string', ['ASSIGNEE', 'VIEWER']).withExample('VIEWER'),
  // Optional
  txhash: genVarchar().withExample(''),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
  is_owner: genEnum('string', ['y', 'n']).withExample('y'),
});

const infoObj = { ...updateInputObj };

const WSUserSchema = new genSchemaSkeleton('WorkspaceUser');

module.exports = WSUserSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
