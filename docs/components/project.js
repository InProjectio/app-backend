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
  project_name: genVarchar().withExample(faker.internet.domainName()),
  // Optional
  workspace_id: genKey(),
  txhash: genVarchar().withExample(''),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
  visible: genChar(1).withExample('y'),
  deleted: genChar(1).withExample('n'),
});

const infoObj = { ...updateInputObj, project_id: genKey() };

const inviteUserObj = genObjectOfArrayOfObject('users', {
  email: genVarchar().withExample(faker.internet.email()),
  fullname: genVarchar().withExample(faker.name.lastName()),
  role: genEnum('string', ['ASSIGNEE', 'VIEWER']).withExample('VIEWER'),
});

const resendMailObj = genObjectOfArrayOfCustomType('emails', 'string', {
  example: faker.internet.email(),
});

const ProjectSchema = new genSchemaSkeleton('Project');

module.exports = ProjectSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .setCustomSchema('ResendMailRequest', resendMailObj)
  .setCustomSchema('InviteUser', inviteUserObj)
  .done();
