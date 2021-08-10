const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const EmojiActivityModel = new DB(process.env.DB_NAME, schemaInfo);

const list = async () => {
  const emojiActList = await EmojiActivityModel.getList();
  return emojiActList;
};

const detail = async (id) => {
  const emojiActDetail = await EmojiActivityModel.getById(id);
  return emojiActDetail;
};

const add = async (data) => {
  EmojiActivityModel.validateData(data);
  const newEmojiActivity = await EmojiActivityModel.createNew(data);
  return newEmojiActivity;
};

const updateById = async (id, data) => {
  const updatedEmojiActivity = await EmojiActivityModel.updateById(id, data, {
    lean: true,
    new: true,
  });
  return updatedEmojiActivity;
};

const deleteById = async (id) => {
  const deletedEmojiActivity = await EmojiActivityModel.deleteById(id, {
    lean: true,
  });
  return deletedEmojiActivity;
};

module.exports = {
  list,
  add,
  updateById,
  deleteById,
  detail,
};
