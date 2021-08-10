const DB = require("../utils/db");

const userSchema = require("../modules/user/schema");
const projectSchema = require("../modules/project/schema");
const workspaceSchema = require("../modules/workspace/schema");
const pjUserSchema = require("../modules/project_user/schema");
const wsUserSchema = require("../modules/workspace_user/schema");
const { cvtArrayToObject } = require("../helpers/transform_data");

const UserModel = new DB(process.env.DB_NAME, userSchema);
const ProjectModel = new DB(process.env.DB_NAME, projectSchema);
const WSModel = new DB(process.env.DB_NAME, workspaceSchema);
const PJUserModel = new DB(process.env.DB_NAME, pjUserSchema);
const WSUserModel = new DB(process.env.DB_NAME, wsUserSchema);

module.exports.getUsersInProject = async (projectId, userId) => {
  // get all project Id that user is being in
  const pjUserQuery = {
    project_id: projectId,
  };

  const pjUserProjection = '_id user_id role is_owner is_accepted';

  const opt = {
    lean: true,
  };
  const pjUserList = await PJUserModel.getList(
    pjUserQuery,
    opt,
    pjUserProjection
  );
  const { pjUserObject, userIds } = pjUserList.reduce(
    (rs, pjUserItem) => {
      const uId = pjUserItem.user_id;
      delete pjUserItem["user_id"];
      const { pjUserObject, userIds } = rs;
      // if (uId !== userId) {
      //   userIds.push(uId);
      // }
      userIds.push(uId);
      pjUserObject[uId] = { ...pjUserItem };
      return rs;
    },
    {
      pjUserObject: {},
      userIds: [],
    }
  );
  // get user list in user ids array
  const userQuery = {
    user_id: { $in: userIds },
  };
  const userProjection = "-password -email_otp";
  const userList = await UserModel.getList(userQuery, opt, userProjection);
  const result = [...userList].map((userItem) => {
    return {
      ...userItem,
      ...pjUserObject[userItem.user_id],
      _id: userItem._id
    };
  });
  return result;
};

module.exports.getUsersInWorkspace = async (workspaceId, userId) => {
  // get all project Id that user is being in
  const wsUserQuery = {
    workspace_id: workspaceId,
  };
  const wsUserProjection = "-_id user_id role is_owner is_accepted";
  const opt = {
    lean: true,
  };
  const wsUserList = await WSUserModel.getList(
    wsUserQuery,
    opt,
    wsUserProjection
  );
  const { wsUserObject, userIds } = wsUserList.reduce(
    (rs, wsUserItem) => {
      const uId = wsUserItem.user_id;
      delete wsUserItem["user_id"];
      const { wsUserObject, userIds } = rs;
      // if (uId !== userId) {
      //   userIds.push(uId);
      // }
      userIds.push(uId);
      wsUserObject[uId] = { ...wsUserItem };
      return rs;
    },
    {
      wsUserObject: {},
      userIds: [],
    }
  );
  // get user list in user ids array
  const userQuery = {
    user_id: { $in: userIds },
  };
  const userProjection = "-_id -password -email_otp";
  const userList = await UserModel.getList(userQuery, opt, userProjection);
  const result = [...userList].map((userItem) => {
    return {
      ...userItem,
      ...wsUserObject[userItem.user_id],
    };
  });
  return result;
};

module.exports.getUsersInTheSameWorkspaces = async (userId) => {
  // get all workspace Id that user is being in
  const query1 = {
    user_id: userId,
  };
  const projection1 = "-_id workspace_id";
  const opt = {
    lean: true,
  };
  const wsUserList1 = await WSUserModel.getList(query1, opt, projection1);
  const wsIds = wsUserList1.map((wsUserItem) => wsUserItem.workspace_id);
  // get all project Ids
  const query2 = {
    workspace_id: { $in: wsIds },
  };
  const projection2 = "-_id project_id";
  const pjList = await ProjectModel.getList(query2, opt, projection2);
  const pjIdSet = new Set(pjList.map((pjItem) => pjItem.project_id));
  const pjIds = [];
  pjIdSet.forEach((pjId) => pjIds.push(pjId));
  // get all user Ids that's in project ids
  const query3 = {
    project_id: { $in: pjIds },
  };
  const projection3 = "-_id user_id";
  const pjUserList = await PJUserModel.getList(query3, opt, projection3);
  const userIdSet = new Set(pjUserList.map((pjUserItem) => pjUserItem.user_id));
  const userIds = [];
  userIdSet.forEach((uId) => {
    if (uId !== userId) {
      userIds.push(uId);
    }
  });
  // get user list in user ids array
  const query4 = {
    user_id: { $in: userIds },
  };
  const projection4 = "-_id -password -email_otp";
  const userList = await UserModel.getList(query4, opt, projection4);
  console.log({
    wsIds,
    pjIds,
    userIds,
    userList,
  });
  return userList;
};
