const { genKey, genSchemaSkeleton, genObjectType } = require('../helpers');

const requestBody = {
  task_id: genKey(),
  label_id: genKey(),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
});

const infoObj = genObjectType({
  ...requestBody,
});

const TaskLabelSchema = new genSchemaSkeleton('TaskLabel');

module.exports = TaskLabelSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .done();
