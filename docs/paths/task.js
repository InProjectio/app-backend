const tags = require("../tags");
const {
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
  genVarchar,
  genAuthRequest,
} = require("../helpers");

const {
  ID_SCHEMA,
  NEW_INPUT_SCHEMA,
  UPDATE_INPUT_SCHEMA,
  genDefaultRes,
  statusResponse,
  txhashResponse,
  foreignKey,
  getCustomSchemaRef,
} = genPathData("Task");

const summaryObject = {
  summary: "Task APIs",
  description: "CRUD APIs to interact with Task Database",
};

const taskTag = [tags.task];

module.exports = {
  // Retrieve data
  "/list": {
    ...summaryObject,
    get: genAuthRequest(taskTag, "Get list of task", {
      responses: genDefaultRes("array"),
    }),
  },
  "/txhash/{txHash}": {
    ...summaryObject,
    get: genAuthRequest(taskTag, "Get detail of task by Tx Hash", {
      parameters: [genParameterItem("txHash", genVarchar(), "Tx Hash")],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, "Task is not found !"),
      },
    }),
  },
  "/{id}/is-deleted": {
    ...summaryObject,
    get: genAuthRequest(taskTag, "Check task is deleted or not", {
      parameters: [genParameterItem("id", ID_SCHEMA, "Task ID")],
      responses: {
        ...statusResponse,
        404: genFailRes(404, "Task is not found !"),
      },
    }),
  },
  "/{id}/txhash": {
    ...summaryObject,
    get: genAuthRequest(taskTag, "Get Tx Hash value by id", {
      parameters: [genParameterItem("id", ID_SCHEMA, "Task ID")],
      responses: {
        ...txhashResponse,
        404: genFailRes(404, "Task is not found !"),
      },
    }),
  },
  "/{id}/folder-id": {
    ...summaryObject,
    get: genAuthRequest(taskTag, "Get Folder ID value by id", {
      parameters: [genParameterItem("id", ID_SCHEMA, "Task ID")],
      responses: {
        ...foreignKey,
        404: genFailRes(404, "Task is not found !"),
      },
    }),
  },
  "/{id}": {
    ...summaryObject,
    get: genAuthRequest(taskTag, "Get detail of task", {
      parameters: [genParameterItem("id", ID_SCHEMA, "Task ID")],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, "Task is not found !"),
      },
    }),
    put: genAuthRequest(taskTag, "Update task by id", {
      parameters: [genParameterItem("id", ID_SCHEMA, "Task ID")],
      requestBody: genRequestBody(getCustomSchemaRef("UpdateTaskObject"), true),
      responses: {
        ...genDefaultRes,
        400: genFailRes(400, "Request is invalid !"),
        404: genFailRes(404, "Task is not found !"),
      },
    }),
    delete: genAuthRequest(taskTag, "Delete task by id", {
      parameters: [genParameterItem("id", ID_SCHEMA, "Task ID")],
      responses: {
        ...genDefaultRes,
        404: genFailRes(404, "Task is not found !"),
      },
    }),
  },
  // Create new data
  "/": {
    ...summaryObject,
    post: genAuthRequest(taskTag, "Create new task", {
      requestBody: genRequestBody(getCustomSchemaRef("NewTaskObject"), true),
      responses: {
        ...genDefaultRes(),
        400: genFailRes(400, "Request is invalid !"),
      },
    }),
  },
};
