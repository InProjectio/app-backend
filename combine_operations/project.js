const DB = require('../utils/db');
const { sendMail } = require('../helpers/mail');
const { generateToken, verifyToken } = require('../helpers/token');

const pjSchema = require('../modules/project/schema');
const folderSchema = require('../modules/folder/schema');
const userSchema = require('../modules/user/schema');
const pjUserSchema = require('../modules/project_user/schema');
const workspaceUserSchema = require('../modules/workspace_user/schema');
const projectUserSchema = require('../modules/project_user/schema');

const ProjectModel = new DB(process.env.DB_NAME, pjSchema);
const FolderModel = new DB(process.env.DB_NAME, folderSchema);
const UserModel = new DB(process.env.DB_NAME, userSchema);
const PJUserModel = new DB(process.env.DB_NAME, pjUserSchema);
const WorkspaceUserModel = new DB(process.env.DB_NAME, workspaceUserSchema);
const ProjectUserModel = new DB(process.env.DB_NAME, projectUserSchema);

const _sendInvitionMail = async (email, data) => {
  const { projectId, projectName, userId } = data;
  try {
    const payload = {
      project_id: projectId,
      user_id: userId,
    };

    const token = generateToken(payload, { expiresIn: '1h' });
    const emailContent = `
    <div>
    <p>You are invited to project ${projectName}</p>
    <div>Please click the below button to accept the invitation:</div>
    <div>
      <a href="${process.env.CLIENT_DOMAIN}/user/project-accept-invitation/${token}" style="height: 45px;width: 130px;border-radius: 10px;display: inline-block;line-height: 45px;text-decoration: none;text-align: center;font-size: 16px;color: white;background-color: mediumpurple;">Accept</>
    </div>
  </div>
`;
    await sendMail(email, '[InProject] Invite to a project', emailContent);
  } catch (error) {
    console.error(error);
  }
  return true;
};

module.exports.resendInvitationMail = async (
  projectId,
  emails,
  currentUserId
) => {
  let status = true;
  try {
    if (emails instanceof Array && emails.length > 0) {
      const [userList, pjInfo] = await Promise.all([
        UserModel.getList(
          {
            email: { $in: emails },
          },
          { lean: true },
          '-_id user_id email'
        ),
        ProjectModel.getOneById(
          {
            field: 'project_id',
            value: projectId,
          },
          {
            lean: true,
          },
          '-_id project_name'
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
        project_id: projectId,
        createdBy: currentUserId,
        is_accepted: 'n',
      };
      const sendPJUsers = await PJUserModel.getList(
        query,
        {
          lean: true,
        },
        '-_id user_id'
      );
      const promises = [];
      for (const pjUser of sendPJUsers) {
        const sendUserId = pjUser.user_id;
        const sendEmail = userDataObject[sendUserId];
        const emailData = {
          projectId,
          projectName: pjInfo.project_name,
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

module.exports.inviteUsersToProject = async (
  projectId,
  users,
  currentUserId
) => {
  let status = true;
  try {
    if (users instanceof Array && users.length > 0) {
      // console.log('inviteUsersToProject ===>', users)
      const [pjInfo, currentUser] = await Promise.all([
        ProjectModel.getOneById(
          {
            field: 'project_id',
            value: projectId,
          },
          { lean: true },
          '-_id project_name'
        ),
        UserModel.getOneById({
          field: 'user_id',
          value: currentUserId,
        }),
      ]);
      if (!pjInfo) {
        const wsIsNotFoundError = new Error('Project is not found !');
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
        const newPJUserObject = {
          project_id: projectId,
          user_id: user.user_id,
          role,
          is_owner: 'n',
          is_accepted: 'n',
          createdBy: currentUser.user_id,
        };
        const pjUser = await PJUserModel.model.findOne({
          project_id: projectId,
          user_id: user.user_id,
        });
        if (pjUser) {
          const acceptedBefore = new Error(
            'The user is already been in the workspace !'
          );
          acceptedBefore.code = 400;
          throw acceptedBefore;
        } else {
          console.log('PJUserModel.createNew', newPJUserObject)
          await Promise.all([
            UserModel.model.findByIdAndUpdate(currentUser._id, {
              $addToSet: { friends: user.user_id },
            }),
            PJUserModel.createNew({ ...newPJUserObject }),
          ]);
        }

        await _sendInvitionMail(email, {
          projectId,
          projectName: pjInfo.project_name,
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
  // console.log('decodeData', decodeData)
  if (!decodeData.project_id || !decodeData.user_id) {
    const invalidRequest = new Error('Invalid request !');
    invalidRequest.code = 404;
    throw invalidRequest;
  }
  const { project_id, user_id } = decodeData;
  const query = {
    project_id,
    user_id,
  };
  const pjUser = await PJUserModel.model.findOne(query, null);
  if (!pjUser || pjUser.is_accepted !== 'n') {
    const invalidRequest = new Error('Invalid request !');
    invalidRequest.code = 400;
    throw invalidRequest;
  }
  pjUser.is_accepted = 'y';
  await pjUser.save();
  return true;
};

module.exports.createNew = async (userId, data) => {
  ProjectModel.validateData(data);
  const newProject = await ProjectModel.createNew(data);
  const workspaceUsers = await WorkspaceUserModel.model.find({
    workspace_id: data.workspace_id
  })
  let projectUsers = workspaceUsers.map((item) => {
    if (item.user_id === +userId) {
      return {
        project_id: newProject.project_id,
        user_id: userId,
        is_owner: 'y',
        is_accepted: 'y',
        role: 'ASSIGNEE',
      }
    }
    return ({
      project_id: newProject.project_id,
      user_id: item.user_id,
      is_owner: 'n',
      is_accepted: 'y',
      role: item.role,
    })
  })
  

  await PJUserModel.model.insertMany(projectUsers, {
    lean: true,
    ordered: true,
  });
  return newProject;
};

module.exports.getProjects = async (currentUser) => {
  try {
    const [userInProjectsResult, listProjects] = await Promise.all([
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
      ]),
      ProjectModel.aggregate([
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
            from: "workspaces",
            localField: "workspace_id", //this is the _id user from tests
            foreignField: "workspace_id", //this is the _id from users
            as: "workspace",
          },
        },
        { $unwind: '$workspace' },

      ]),
    ])


    const projects = []
    const projectIds = []
    userInProjectsResult.forEach((item) => {
      if (item.project && projectIds.indexOf(item.project.project_id) === -1) {
        projectIds.push(item.project.project_id)
        projects.push({
          label: item.project.project_name,
          workspaceName: item.workspace.workspace_name,
          value: item.project.project_id
        })
      }
    })

    listProjects.forEach((project) => {
      if (projectIds.indexOf(project.project_id) === -1) {
        projectIds.push(project.project_id)
        projects.push({
          label: project.project_name,
          workspaceName: project.workspace.workspace_name,
          value: project.project_id
        })
      }
    })

    return projects

  } catch(e) {
    console.log(e)
    return Promise.reject(e)
  }
}