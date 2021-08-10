const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const PjUserModel = new DB(process.env.DB_NAME, schemaInfo);

const _checkPermission = async (pjId, userId) => {
  const hasPermission = await PjUserModel.isExist({
    project_id: pjId,
    user_id: userId,
    is_owner: 'y',
  });
  if (!hasPermission) {
    const permissionDenied = new Error('Permission denied !');
    permissionDenied.code = 400;
    throw permissionDenied;
  }
  return true;
};

// Retrieve data

module.exports.list = async () => {
  const query = {};
  const pjUserList = await PjUserModel.getList(query);
  return pjUserList;
};

module.exports.detail = async (pjId, userId) => {
  const pjUserDetail = await PjUserModel.getOneById({
    field: 'project_id',
    value: pjId,
    otherOptions: {
      user_id: userId,
    },
  });
  return pjUserDetail;
};

module.exports.detailByTxhash = async (txhash) => {
  const pjUserDetail = await PjUserModel.getOneById({
    field: 'txhash',
    value: txhash,
  });
  return pjUserDetail;
};

module.exports.getUsersOfProject = async (pjId) => {
  const query = {
    project_id: pjId,
  };
  const pjUserList = await PjUserModel.getList(query);
  return pjUserList;
};

module.exports.getTxHashById = async (id) => {
  const pjUserDetail = await PjUserModel.getOneById({
    field: 'pjUser_id',
    value: id,
  });
  return pjUserDetail.txhash + '';
};

module.exports.getTaskIdById = async (id) => {
  const pjUserDetail = await PjUserModel.getOneById({
    field: 'pjUser_id',
    value: id,
  });
  return pjUserDetail.task_id + '';
};

module.exports.getRole = async (pjId, userId) => {
  const pjUserDetail = await PjUserModel.getOneById({
    field: 'project_id',
    value: pjId,
    otherOptions: {
      user_id: userId,
    },
  });
  return pjUserDetail.role;
};

module.exports.getUsersByProjectId = async (pjId) => {
  const data = await PjUserModel.model
    .aggregate()
    .match({
      project_id: parseInt(pjId),
    })
    .lookup({
      from: 'users',
      localField: 'user_id',
      foreignField: 'user_id',
      as: 'user',
    })
    .unwind('user')
    .project({
      user: 1,
      project_id: 1,
      _id: 0,
    })
    .project({
      'user.password': 0,
    })
    .group({
      _id: '$project_id',
      users: { $push: '$user' },
    })
    .exec();
  if (!data || !data.length) {
    return [];
  }
  return data[0].users;
};

module.exports.getProjectsByUserId = async (userId, workspaceId = null) => {
  let aggregate = PjUserModel.model.aggregate();
  aggregate = aggregate
    .match({
      user_id: parseInt(userId),
    })
    .lookup({
      from: 'projects',
      localField: 'project_id',
      foreignField: 'project_id',
      as: 'project',
    })
    .unwind('project')
    .project({
      project: 1,
      user_id: 1,
      _id: 0,
    });
  if (workspaceId) {
    aggregate = aggregate.match({
      'project.workspace_id': parseInt(workspaceId),
    });
  }
  aggregate = aggregate.group({
    _id: '$user_id',
    projects: { $push: '$project' },
  });
  const data = await aggregate.exec();
  if (!data || !data.length) {
    return [];
  }
  return data[0].projects;
};

module.exports.checkIsOwnerOrNot = async (pjId, userId) => {
  const pjUserDetail = await PjUserModel.getOneById({
    field: 'project_id',
    value: pjId,
    otherOptions: {
      user_id: userId,
    },
  });
  return pjUserDetail.isOwner === 'y' ? 'true' : 'false';
};

// Create new data

module.exports.add = async (data) => {
  PjUserModel.validateData(data);
  const newPjUser = await PjUserModel.createNew(data);
  return newPjUser;
};

// Update existed data

module.exports.updateById = async (requestUserId, pjId, userId, data) => {
  await _checkPermission(pjId, requestUserId);

  const updatedPjUser = await PjUserModel.updateOneById(
    { field: 'project_id', value: pjId, otherOptions: { user_id: userId } },
    data,
    {
      lean: true,
      new: true,
    }
  );
  return updatedPjUser;
};

module.exports.switchVisibleStt = async (id) => {
  const updatedPjUser = await PjUserModel.switchStatus(
    { field: 'pjUser_id', value: id },
    'visible',
    {
      lean: true,
      new: true,
    }
  );
  return updatedPjUser;
};

module.exports.deleteById = async (requestUserId, pjId, userId, txhash = null) => {
  await _checkPermission(pjId, requestUserId);

  const otherOptions = {
    user_id: userId,
  };
  if (txhash || txhash !== '') {
    otherOptions['txhash'] = txhash;
  }
  const deletedPjUser = await PjUserModel.deleteOneById({
    field: 'project_id',
    value: pjId,
    otherOptions,
  });
  return deletedPjUser;
};
