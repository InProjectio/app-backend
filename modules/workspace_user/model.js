const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const WSUserModel = new DB(process.env.DB_NAME, schemaInfo);

const _checkPermission = async (wsId, userId) => {
  const hasPermission = await WSUserModel.isExist({
    workspace_id: wsId,
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

// module.exports.list = async () => {
//   const query = {};
//   const wsUserList = await WSUserModel.getList(query);
//   return wsUserList;
// };

module.exports.detail = async (wsId, userId) => {
  const wsUserDetail = await WSUserModel.getOneById({
    field: 'workspace_id',
    value: wsId,
    otherOptions: { user_id: userId },
  });
  return wsUserDetail;
};

module.exports.getDetailByTxHash = async (txHash) => {
  const wsUserDetail = await WSUserModel.getOneById({
    field: 'txhash',
    value: txHash,
  });
  return wsUserDetail;
};

// module.exports.getTxHashById = async (id) => {
//   const wsUserDetail = await WSUserModel.getOneById({
//     field: 'wsUser_id',
//     value: id,
//     otherOptions: { deleted: 'n' },
//   });
//   return wsUserDetail.txhash + '';
// };

module.exports.getRole = async (wsId, userId) => {
  const wsUserDetail = await WSUserModel.getOneById({
    field: 'workspace_id',
    value: wsId,
    otherOptions: { user_id: userId },
  });
  return wsUserDetail.role;
};

module.exports.checkIsOwnerOrNot = async (wsId, userId) => {
  const wsUserDetail = await WSUserModel.getOneById({
    field: 'workspace_id',
    value: wsId,
    otherOptions: { user_id: userId },
  });
  return wsUserDetail.is_owner === 'y' ? 'true' : 'false';
};

// module.exports.checkIsAssigneeOrNot = async (wsId, userId) => {
//   const wsUserDetail = await WSUserModel.getOneById({
//     field: 'workspace_id',
//     value: wsId,
//     otherOptions: { user_id: userId },
//   });
//   return wsUserDetail.is_assignee === 'y' ? 'true' : 'false';
// };

// module.exports.checkIsWatchOrNot = async (wsId, userId) => {
//   const wsUserDetail = await WSUserModel.getOneById({
//     field: 'workspace_id',
//     value: wsId,
//     otherOptions: { user_id: userId },
//   });
//   return wsUserDetail.watch === 'y' ? 'true' : 'false';
// };

module.exports.getUsersByWSId = async (wsId) => {
  const data = await WSUserModel.model
    .aggregate()
    .match({
      workspace_id: parseInt(wsId),
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
      workspace_id: 1,
      _id: 0,
    })
    .project({
      'user.password': 0,
    })
    .group({
      _id: '$workspace_id',
      users: { $push: '$user' },
    })
    .exec();
  if (!data || !data.length) {
    return [];
  }
  return data[0].users;
};

module.exports.getWorkspacesByUserId = async (userId) => {
  let aggregate = WSUserModel.model.aggregate();
  aggregate = aggregate
    .match({
      user_id: parseInt(userId),
    })
    .lookup({
      from: 'workspaces',
      localField: 'workspace_id',
      foreignField: 'workspace_id',
      as: 'workspace',
    })
    .unwind('workspace')
    .project({
      workspace: 1,
      user_id: 1,
      _id: 0,
    });
  aggregate = aggregate.group({
    _id: '$user_id',
    workspaces: { $push: '$workspace' },
  });
  const data = await aggregate.exec();
  if (!data || !data.length) {
    return [];
  }
  return data[0].workspaces;
};

// Create new data

module.exports.add = async (data) => {
  WSUserModel.validateData(data);
  const newWSUser = await WSUserModel.createNew(data);
  return newWSUser;
};

// Update existed data

module.exports.updateById = async (requestUserId, wsId, userId, data) => {
  await _checkPermission(wsId, requestUserId);

  const query = {
    field: 'workspace_id',
    value: wsId,
    otherOptions: { user_id: userId },
  };
  const updatedWSUser = await WSUserModel.updateOneById(query, data, {
    lean: true,
    new: true,
  });
  return updatedWSUser;
};

module.exports.deleteById = async (
  requestUserId,
  wsId,
  userId,
  txhash = null
) => {
  await _checkPermission(wsId, requestUserId);

  const otherOptions = { user_id: userId };
  if (txhash && txhash !== '') {
    otherOptions['txhash'] = txhash;
  }
  const query = {
    field: 'workspace_id',
    value: wsId,
    otherOptions,
  };
  const deletedWSUser = await WSUserModel.deleteOneById(query);
  return deletedWSUser;
};
