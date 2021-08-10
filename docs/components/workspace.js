const faker = require('faker');
const {
  genKey,
  genVarchar,
  genSchemaSkeleton,
  genChar,
  genObjectType,
  genEnum,
  genObjectOfArrayOfObject,
  genObjectOfArrayOfCustomType,
} = require('../helpers');

const requestBody = {
  // Required
  workspace_name: genVarchar().withExample(faker.internet.domainName()),
  // Optional
  thumbnail_url: genVarchar().withExample(''),
  txhash: genVarchar().withExample(''),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
  visible: genChar(1).withExample('y'),
  deleted: genChar(1).withExample('n'),
});

const infoObj = { ...updateInputObj, workspace_id: genKey() };

const inviteUserObj = genObjectOfArrayOfObject('users', {
  email: genVarchar().withExample(faker.internet.email()),
  fullname: genVarchar().withExample(faker.name.lastName()),
  role: genEnum('string', ['ASSIGNEE', 'VIEWER']).withExample('VIEWER'),
});

const resendMailObj = genObjectOfArrayOfCustomType('emails', 'string', {
  example: faker.internet.email(),
});

const WorkspaceSchema = new genSchemaSkeleton('Workspace');

module.exports = WorkspaceSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .setCustomSchema('InviteUser', inviteUserObj)
  .setCustomSchema('ResendMailRequest', resendMailObj)
  .done();
