const { genKey, genSchemaSkeleton, genObjectType } = require('../helpers');

const requestBody = {
  task_parent_id: genKey(),
  task_child_id: genKey(),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
});

const infoObj = genObjectType({
  ...requestBody,
});

const DepTaskSchema = new genSchemaSkeleton('DepTask');

module.exports = DepTaskSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
