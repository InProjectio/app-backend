const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const AttachmentModel = new DB(process.env.DB_NAME, schemaInfo);

// Retrieve data

module.exports.list = async () => {
  const query = {
    deleted: 'n',
  };
  const attachmentList = await AttachmentModel.getList(query);
  return attachmentList;
};

module.exports.detail = async (id) => {
  const attachmentDetail = await AttachmentModel.getOneById({
    field: 'attachment_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return attachmentDetail;
};

module.exports.getDetailByTxHash = async (txHash) => {
  const attachmentDetail = await AttachmentModel.getOneById({
    field: 'txhash',
    value: txHash,
    otherOptions: { deleted: 'n' },
  });
  return attachmentDetail;
};

module.exports.getTxHashById = async (id) => {
  const attachmentDetail = await AttachmentModel.getOneById({
    field: 'attachment_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return attachmentDetail.txhash + '';
};

module.exports.getTaskIdById = async (id) => {
  const attachmentDetail = await AttachmentModel.getOneById({
    field: 'attachment_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return attachmentDetail.task_id + '';
};

module.exports.getUserIdById = async (id) => {
  const attachmentDetail = await AttachmentModel.getOneById({
    field: 'attachment_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return attachmentDetail.user_id + '';
};

module.exports.checkIsVisibleOrNot = async (id) => {
  const attachmentDetail = await AttachmentModel.getOneById({
    field: 'attachment_id',
    value: id,
    otherOptions: { deleted: 'n' },
  });
  return attachmentDetail.visible === 'y' ? 'true' : 'false';
};

module.exports.checkIsDeletedOrNot = async (id) => {
  const attachmentDetail = await AttachmentModel.getOneById({
    field: 'attachment_id',
    value: id,
  });
  return attachmentDetail.deleted === 'y' ? 'true' : 'false';
};

// Create new data

module.exports.add = async (data) => {
  AttachmentModel.validateData(data);
  const newAttachment = await AttachmentModel.createNew(data);
  return newAttachment;
};

module.exports.uploadAttachments = async (files, userId, rest = {}) => {
  const result = [];
  if (files instanceof Array && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const { path, filename } = files[i];
      const attachmentData = {
        attachment_location: path,
        attachment_name: filename,
        attachment_link:
          process.env.SERVER_DOMAIN +
          `/attachment/get-attachment?filename=${filename}`,
        user_id: userId,
        ...rest,
      };
      const newAttachment = await AttachmentModel.createNew(attachmentData);
      result.push({
        attachment_id: newAttachment.attachment_id,
        attachment_name: newAttachment.attachment_name,
        attachment_link: newAttachment.attachment_link,
      });
    }
  }
  return result;
};

// Update existed data

module.exports.updateById = async (id, data) => {
  const updatedAttachment = await AttachmentModel.updateOneById(
    { field: 'attachment_id', value: id, otherOptions: { deleted: 'n' } },
    data,
    {
      lean: true,
      new: true,
    }
  );
  return updatedAttachment;
};

module.exports.switchVisibleStt = async (id) => {
  const updatedAttachment = await AttachmentModel.switchStatus(
    { field: 'attachment_id', value: id, otherOptions: { deleted: 'n' } },
    'visible',
    {
      lean: true,
      new: true,
    }
  );
  return updatedAttachment;
};

module.exports.deleteById = async (id) => {
  const deletedAttachment = await AttachmentModel.updateOneById(
    { field: 'attachment_id', value: id, otherOptions: { deleted: 'n' } },
    { deleted: 'y' },
    {
      lean: true,
      new: true,
    }
  );
  return deletedAttachment;
};
