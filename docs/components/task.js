const faker = require("faker");
const {
  genKey,
  genVarchar,
  genSchemaSkeleton,
  genObjectType,
  genInteger,
  genEnum,
  genTimestamp,
  genArrayOfObject,
  genArrayOfCustomType,
} = require("../helpers");

const requestBody = {
  // Required
  folder_id: genKey(),
  task_name: genVarchar().withExample(faker.internet.domainName()),
  // Optional
  txhash: genVarchar().withExample(""),
};

const newInputObj = genObjectType({ ...requestBody });

const updateInputObj = genObjectType({
  ...requestBody,
  dependency_id: genKey(),
  order: genInteger(),
  description: genVarchar().withExample(""),
  start_date: genTimestamp(),
  end_date: genTimestamp(),
  estimate: genInteger(),
  duedate_reminder: genInteger(),
  status: genEnum("string", ["todo", "progress", "ready", "complete"]),
  budget: genInteger(),
  spend: genInteger(),
  cover_img_url: genVarchar().withExample(""),
  deleted: genEnum("string", ["n", "y"]),
});

const infoObj = { ...updateInputObj, task_id: genKey() };

const newTaskObject = genObjectType({
  folder_id: genKey(),
  task_name: genVarchar(),
  labels: genArrayOfObject({
    id: genKey(),
    name: genVarchar(),
    color: genVarchar(),
  }),
  members: genArrayOfCustomType("number"),
  checklist: genObjectType({
    title: genVarchar(),
    items: genArrayOfObject({
      name: genVarchar(),
    }),
  }),
  attachments: genArrayOfObject({
    name: genVarchar(),
    link: genVarchar(),
    location: genVarchar(),
  }),
});

const updateTaskObject = genObjectType({
  folder_id: genKey(),
  task_name: genVarchar(),
  labels: genArrayOfObject({
    id: genKey(),
    name: genVarchar(),
    color: genVarchar(),
  }),
  members: genArrayOfCustomType("number"),
  checklist: genObjectType({
    id: genKey(),
    title: genVarchar(),
    items: genArrayOfObject({
      name: genVarchar(),
    }),
  }),
  attachments: genArrayOfObject({
    id: genKey(),
    name: genVarchar(),
    link: genVarchar(),
    location: genVarchar(),
  }),
});

const TaskSchema = new genSchemaSkeleton("Task");

module.exports = TaskSchema.setID(genKey())
  .setNewInput(newInputObj)
  .setUpdateInput(updateInputObj)
  .setInfo(infoObj)
  .setCustomSchema("NewTaskObject", newTaskObject)
  .setCustomSchema("UpdateTaskObject", updateTaskObject)
  .done();
