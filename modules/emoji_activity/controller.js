const EmojiModel = require('./model');

const getListEmojiAct = async (req, res, next) => {
  try {
    const result = await EmojiModel.list();
    next(result);
  } catch (error) {
    next(error);
  }
};

const getEmojiActDetail = async (req, res, next) => {
  try {
    const emojiActId = req.params.id;
    const result = await EmojiModel.detail(emojiActId);
    next(result);
  } catch (error) {
    next(error);
  }
};

const createEmojiAct = async (req, res, next) => {
  try {
    const result = await EmojiModel.add(req.body);
    next(result);
  } catch (error) {
    next(error);
  }
};

const updateEmojiActById = async (req, res, next) => {
  try {
    const emojiActId = req.params.id;
    const data = req.body;
    const result = await EmojiModel.updateById(emojiActId, data);
    next(result);
  } catch (error) {
    next(error);
  }
};

const deleteEmojiActById = async (req, res, next) => {
  try {
    const emojiActId = req.params.id;
    const result = await EmojiModel.deleteById(emojiActId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListEmojiAct,
  getEmojiActDetail,
  createEmojiAct,
  updateEmojiActById,
  deleteEmojiActById,
};
