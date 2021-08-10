const faker = require('faker');
const {
  genKey,
  genVarchar,
  genSchemaSkeleton,
  genChar,
  genObjectType,
  genTimestamp,
} = require('../helpers');

const requestBody = {
  // Required
  folder_name: genVarchar().withExample(faker.internet.domainName()),
  // Optional
  project_id: genKey(),
  txhash: genVarchar().withExample(''),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
  visible: genChar(1).withExample('y'),
  deleted: genChar(1).withExample('n'),
  end_date: genTimestamp(),
});

const infoObj = {
  folder_id: genKey(),
  ...updateInputObj,
};

const FolderSchema = new genSchemaSkeleton('Folder');

module.exports = FolderSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
