const DB = require('../utils/db');
const { sendMail } = require('../helpers/mail');
const { generateToken, verifyToken } = require('../helpers/token');

const wsSchema = require('../modules/workspace/schema');
const pjSchema = require('../modules/project/schema');
const folderSchema = require('../modules/folder/schema');
const userSchema = require('../modules/user/schema');
const wsUserSchema = require('../modules/workspace_user/schema');
const projectUserSchema = require('../modules/project_user/schema');

const WorkspaceModel = new DB(process.env.DB_NAME, wsSchema);
const ProjectModel = new DB(process.env.DB_NAME, pjSchema);
const FolderModel = new DB(process.env.DB_NAME, folderSchema);
const UserModel = new DB(process.env.DB_NAME, userSchema);
const WSUserModel = new DB(process.env.DB_NAME, wsUserSchema);
const ProjectUserModel = new DB(process.env.DB_NAME, projectUserSchema);

const _sendInvitionMail = async (email, data) => {
  const { workspaceId, workspaceName, userId } = data;
  try {
    const payload = {
      workspace_id: workspaceId,
      user_id: userId,
    };

    const token = generateToken(payload, { expiresIn: '1h' });
    const emailContent = `
      <div>
        <p>You are invited to workspace ${workspaceName}</p>
        <div>Please click the below button to accept the invitation:</div>
        <div>
          <a href="${process.env.CLIENT_DOMAIN}/user/workspace-accept-invitation/${token}" style="height: 45px;width: 130px;border-radius: 10px;display: inline-block;line-height: 45px;text-decoration: none;text-align: center;font-size: 16px;color: white;background-color: mediumpurple;">Accept</>
        </div>
      </div>
    `;
    await sendMail(email, '[InProject] Invite to a workspace', emailContent);
  } catch (error) {
    console.error(error);
  }
  return true;
};


module.exports.getWSListOfDetail = async (currentUser) => {

  let result = [];
  // const wsQuery = {
  //   deleted: 'n',
  //   txhash: {
  //     $ne: null
  //   },
  //   visible: 'y'
  // };
  // const wsProjection = 'workspace_id workspace_name thumbnail_url visible -_id';
  // const wsOpt = { lean: true };
  // WorkspaceModel.getList(
  //   wsQuery,
  //   wsOpt,
  //   wsProjection
  // ),
  let [workspaceList, userInWorkspacesResult, userInProjectsResult] = await Promise.all([
    WorkspaceModel.aggregate([
      {
        $match: {
          deleted: 'n',
          txhash: {
            $ne: null
          },
          visible: 'y'
        },
      },
      {
        $lookup: {
          from: "workspaceusers",
          localField: "workspace_id", //this is the _id user from tests
          foreignField: "workspace_id", //this is the _id from users
          as: "workspaceUser",
        },
      },
      {
        "$addFields": {
            "workspaceUser": {
                "$arrayElemAt": [
                    {
                        "$filter": {
                            "input": "$workspaceUser",
                            "as": "workspaceUser",
                            "cond": {
                                $and: [
                                  {"$eq": [ "$$workspaceUser.user_id", currentUser.user_id ]},
                                ]
                            }
                        }
                    }, 0
                ]
            }
        }
      },
    ]),
    WSUserModel.aggregate([
      {
        $match: {
          user_id: currentUser.user_id,
          is_accepted: 'y'
        },
      },
      {
        $lookup: {
          from: "workspaces",
          localField: "workspace_id", //this is the _id user from tests
          foreignField: "workspace_id", //this is the _id from users
          as: "workspace",
        },
      },
      {
        "$addFields": {
            "workspace": {
                "$arrayElemAt": [
                    {
                        "$filter": {
                            "input": "$workspace",
                            "as": "workspace",
                            "cond": {
                                $and: [
                                  {"$eq": [ "$$workspace.deleted", "n" ]},
                                  {"$eq": [ "$$workspace.visible", "n" ]},
                                ]
                            }
                        }
                    }, 0
                ]
            }
        }
      },
    ]),
    ProjectUserModel.aggregate([
      {
        $match: {
          user_id: currentUser.user_id,
          is_accepted: 'y'
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "project_id", //this is the _id user from tests
          foreignField: "project_id", //this is the _id from users
          as: "project",
        },
      },
      {
        "$addFields": {
            "project": {
                "$arrayElemAt": [
                    {
                        "$filter": {
                            "input": "$project",
                            "as": "project",
                            "cond": {
                                $and: [
                                  {"$eq": [ "$$project.deleted", "n" ]},
                                  {"$eq": [ "$$project.visible", "n" ]},
                                ]
                            }
                        }
                    }, 0
                ]
            }
        }
      },
      {
        $lookup: {
          from: "workspaces",
          localField: "project.workspace_id", //this is the _id user from tests
          foreignField: "workspace_id", //this is the _id from users
          as: "workspace",
        },
      },
      { $unwind: '$workspace' },
    ])
  ])

  const userInWorkspaces =  userInWorkspacesResult
    .filter(item => item.workspace && item.workspace.txhash)
    .map((item) => ({...item, ...item.workspace}))

  workspaceList = workspaceList.map((item) => ({
    ...item.workspaceUser,
    ...item,
  }))

  // console.log('workspaceList ====>', workspaceList)

  workspaceList = [...userInWorkspaces, ...workspaceList]

  let wsIds = workspaceList.map((wsItem) => wsItem.workspace_id);

  const userInProjects = userInProjectsResult
  .filter((item) => item.project && item.project.txhash)
  .map((item) => {
    if (item.project && item.workspace.deleted === 'n' && wsIds.indexOf(item.project.workspace_id) === -1) {
      workspaceList = [item.workspace, ...workspaceList]
      wsIds = [item.workspace.workspace_id, ...wsIds]
    }

    return ({
      ...item.project,
      ...item,
    })
  })

  // console.log('userInProjects ====>', userInProjects)
  // console.log('userInWorkspacesResult ====>', userInWorkspaces)
  if (workspaceList.length > 0) {
    
    const wsUserQuery = {
      workspace_id: { $in: wsIds },
      is_owner: 'y',
    };
    const wsUserProjection = '-_id user_id workspace_id';
    // const pjQuery = {
    //   deleted: 'n',
    //   workspace_id: { $in: wsIds },
    //   txhash: {
    //     $ne: null
    //   },
    //   visible: 'y'
    // };
    // const pjOpt = { lean: true };
    // const pjProjection = 'project_id workspace_id project_name visible -_id';
    let [wsUserData, projectList] = await Promise.all([
      WSUserModel.getList(wsUserQuery, { lean: true }, wsUserProjection),
      ProjectModel.aggregate([
        {
          $match: {
            deleted: 'n',
            workspace_id: { $in: wsIds },
            txhash: {
              $ne: null
            },
            visible: 'y'
          },
        },
        {
          $lookup: {
            from: "projectusers",
            localField: "project_id", //this is the _id user from tests
            foreignField: "project_id", //this is the _id from users
            as: "projectUser",
          },
        },
        {
          "$addFields": {
              "projectUser": {
                  "$arrayElemAt": [
                      {
                          "$filter": {
                              "input": "$projectUser",
                              "as": "projectUser",
                              "cond": {
                                  $and: [
                                    {"$eq": [ "$$projectUser.user_id", currentUser.user_id ]},
                                  ]
                              }
                          }
                      }, 0
                  ]
              }
          }
        },
      ]),
    ]);
    const wsUserObject = wsUserData.reduce((rs, item) => {
      rs[item.workspace_id] = item.user_id;
      return rs;
    }, {});
    let pjIds = []
    projectList = projectList.map((pjItem) => {
      pjIds.push(pjItem.project_id)
      return ({
        ...pjItem.projectUser,
        ...pjItem,
      })
    })
    userInProjects.forEach((item) => {
      if (pjIds.indexOf(item.project_id) === -1) {
        projectList = [item, ...projectList]
        pjIds = [item.project_id, ...pjIds]
      }
    })
    
    if (projectList.length > 0) {
      
      const folderQuery = {
        deleted: 'n',
        project_id: { $in: pjIds },
        txhash: {
          $ne: null
        }
      };
      const folderOpt = { lean: true };
      const folderProjection = 'folder_id project_id folder_name visible';
      const folderList = await FolderModel.getList(
        folderQuery,
        folderOpt,
        folderProjection
      );
      if (folderList.length > 0) {
        result = workspaceList.map((wsItem) => {
          const { workspace_id } = wsItem;
          const projects = projectList
            .filter((pjItem) => pjItem.workspace_id === workspace_id)
            .map((pjItem) => {
              const { project_id } = pjItem;
              const phases = folderList
                .filter((folderItem) => folderItem.project_id === project_id)
                .map((fItem) => {
                  delete fItem['project_id'];
                  return fItem;
                });
              delete pjItem['workspace_id'];
              return {
                ...pjItem,
                phases,
              };
            });
          return {
            ...wsItem,
            user_id_owner: wsUserObject[wsItem.workspace_id],
            projects,
          };
        });
      } else {
        result = workspaceList.map((wsItem) => {
          const { workspace_id } = wsItem;
          const projects = projectList
            .filter((pjItem) => pjItem.workspace_id === workspace_id)
            .map((item) => {
              delete item['workspace_id'];
              return { ...item, phases: [] };
            });
          return {
            ...wsItem,
            user_id_owner: wsUserObject[wsItem.workspace_id],
            projects,
          };
        });
      }
    } else {
      result = workspaceList.map((wsItem) => ({
        ...wsItem,
        user_id_owner: wsUserObject[wsItem.workspace_id],
        projects: [],
      }));
    }
  }

  return result;
};

module.exports.resendInvitationMail = async (
  workspaceId,
  emails,
  currentUserId
) => {
  let status = true;
  try {
    if (emails instanceof Array && emails.length > 0) {
      const [userList, wsInfo] = await Promise.all([
        UserModel.getList(
          {
            email: { $in: emails },
          },
          { lean: true },
          '-_id user_id email'
        ),
        WorkspaceModel.getOneById(
          {
            field: 'workspace_id',
            value: workspaceId,
          },
          {
            lean: true,
          },
          '-_id workspace_name'
        ),
      ]);
      const { userDataObject, userIds } = userList.reduce(
        (rs, item) => {
          rs['userDataObject'][item.user_id] = item.email;
          rs['userIds'].push(item.user_id);
          return rs;
        },
        { userDataObject: {}, userIds: [] }
      );

      const query = {
        user_id: { $in: userIds },
        workspace_id: workspaceId,
        createdBy: currentUserId,
        is_accepted: 'n',
      };
      const sendWSUsers = await WSUserModel.getList(
        query,
        {
          lean: true,
        },
        '-_id user_id'
      );
      const promises = [];
      for (const wsUser of sendWSUsers) {
        const sendUserId = wsUser.user_id;
        const sendEmail = userDataObject[sendUserId];
        const emailData = {
          workspaceId,
          workspaceName: wsInfo.workspace_name,
          userId: sendUserId,
        };
        promises.push(_sendInvitionMail(sendEmail, emailData));
      }
      await Promise.all(promises);
    }
  } catch (error) {
    console.error(error);
    status = false;
  }
  return status;
};

module.exports.inviteUsersToWorkspace = async (
  workspaceId,
  users,
  currentUserId
) => {
  let status = true;
  try {
    if (users instanceof Array && users.length > 0) {
      const [wsInfo, currentUser] = await Promise.all([
        WorkspaceModel.getOneById(
          {
            field: 'workspace_id',
            value: workspaceId,
          },
          { lean: true },
          '-_id workspace_name'
        ),
        UserModel.getOneById({
          field: 'user_id',
          value: currentUserId,
        }),
      ]);
      if (!wsInfo) {
        const wsIsNotFoundError = new Error('Workspace is not found !');
        wsIsNotFoundError.code = 400;
        throw wsIsNotFoundError;
      }
      for (let i = 0; i < users.length; i++) {
        const { email, fullname, role } = users[i];
        const query = {
          email,
        };
        const projection = 'user_id email username';
        const opt = {
          lean: true,
        };
        let user = await UserModel.model.findOne(query, projection, opt);
        if (!user) {
          const newUser = await UserModel.createNew({
            email,
            fullname,
          });
          user = newUser.toJSON();
        }
        const newWSUserObject = {
          workspace_id: workspaceId,
          user_id: user.user_id,
          role,
          is_owner: 'n',
          is_accepted: 'n',
          createdBy: currentUser.user_id,
        };
        const wsUser = await WSUserModel.model.findOne({
          workspace_id: workspaceId,
          user_id: user.user_id,
        });
        if (wsUser) {
          const acceptedBefore = new Error(
            'The user is already been in the workspace !'
          );
          acceptedBefore.code = 400;
          throw acceptedBefore;
        } else {
          await Promise.all([
            UserModel.model.findByIdAndUpdate(currentUser._id, {
              $addToSet: { friends: user.user_id },
            }),
            WSUserModel.createNew({ ...newWSUserObject }),
          ]);
        }

        await _sendInvitionMail(email, {
          workspaceId,
          workspaceName: wsInfo.workspace_name,
          userId: user.user_id,
        });
      }
    } else {
      const inputUsersIsEmpty = new Error('Users is empty array !');
      inputUsersIsEmpty.code = 400;
      throw inputUsersIsEmpty;
    }
  } catch (error) {
    status = false;
    console.error(error);
  }
  return status + '';
};

module.exports.acceptInvitation = async (token) => {
  if (!token) {
    const invalidRequest = new Error('Token is not found !');
    invalidRequest.code = 400;
    throw invalidRequest;
  }
  const decodeData = verifyToken(token);
  if (!decodeData.workspace_id || !decodeData.user_id) {
    const invalidRequest = new Error('Invalid request !');
    invalidRequest.code = 404;
    throw invalidRequest;
  }
  const { workspace_id, user_id } = decodeData;
  const query = {
    workspace_id,
    user_id,
  };
  const wsUser = await WSUserModel.model.findOne(query, null);
  if (!wsUser || wsUser.is_accepted !== 'n') {
    const invalidRequest = new Error('Invalid request !');
    invalidRequest.code = 400;
    throw invalidRequest;
  }
  wsUser.is_accepted = 'y';
  await wsUser.save();

  const projects = await ProjectModel.model.find({
    workspace_id
  })

  let projectUsers = projects.map((item) => ({
    project_id: item.project_id,
    user_id,
    is_owner: 'n',
    is_accepted: 'y',
    role: wsUser.role,
  }))

  await ProjectUserModel.model.insertMany(projectUsers, {
    lean: true,
    ordered: true,
  });

  return true;
};

module.exports.createNew = async (userId, data) => {
  WorkspaceModel.validateData(data);
  const newWorkspace = await WorkspaceModel.createNew(data);
  const wsUserData = {
    workspace_id: newWorkspace.workspace_id,
    user_id: userId,
    is_owner: 'y',
    is_accepted: 'y',
    role: 'ASSIGNEE',
  };
  await WSUserModel.createNew(wsUserData);
  return newWorkspace;
};
