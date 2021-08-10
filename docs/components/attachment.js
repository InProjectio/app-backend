const faker = require('faker');
const {
  genKey,
  genVarchar,
  genSchemaSkeleton,
  genChar,
  genObjectType,
  genInteger,
  genArrayOfCustomType,
} = require('../helpers');

const requestBody = {
  // Required
  attachment_location: genVarchar().withExample(faker.address.country()),
  // Optional
  task_id: genInteger(),
  user_id: genInteger(),
  activity_id: genInteger(),
  attachment_name: genVarchar().withExample(''),
  attachment_link: genVarchar().withExample(''),
  txhash: genVarchar().withExample(''),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
  deleted: genChar(1).withExample('n'),
});

const infoObj = { ...updateInputObj, attachment_id: genKey() };

const uploadResponse = genObjectType({
  attachment_id: genKey(),
  attachment_name: genVarchar(),
  attachment_link: genVarchar(),
});

const AttachmentSchema = new genSchemaSkeleton('Attachment');

module.exports = AttachmentSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .setCustomSchema('UploadResponse', uploadResponse)
  .done();
