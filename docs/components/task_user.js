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
  task_id: genKey(),
  user_id: genKey(),
  is_owner: genEnum('string', ['y', 'n']).withExample('y'),
  // Optional
  txhash: genVarchar().withExample(''),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
  is_assignee: genEnum('string', ['y', 'n']).withExample('y'),
  watch: genEnum('string', ['y', 'n']).withExample('y'),
});

const infoObj = { ...updateInputObj };

const TaskUserSchema = new genSchemaSkeleton('TaskUser');

module.exports = TaskUserSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
