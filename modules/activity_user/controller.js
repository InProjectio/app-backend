const { list, add, updateById, deleteById, detail } = require('./model');

const getListAcUser = async (req, res, next) => {
  try {
    const result = await list();
    next(result);
  } catch (error) {
    next(error);
  }
};

const getAcUserDetail = async (req, res, next) => {
  try {
    const acUserId = req.params.id;
    const result = await detail(acUserId);
    next(result);
  } catch (error) {
    next(error);
  }
};

const createAcUser = async (req, res, next) => {
  try {
    const result = await add(req.body);
    next(result);
  } catch (error) {
    next(error);
  }
};

const updateAcUserById = async (req, res, next) => {
  try {
    const acUserId = req.params.id;
    const data = req.body;
    const result = await updateById(acUserId, data);
    next(result);
  } catch (error) {
    next(error);
  }
};

const deleteAcUserById = async (req, res, next) => {
  try {
    const acUserId = req.params.id;
    const result = await deleteById(acUserId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListAcUser,
  getAcUserDetail,
  createAcUser,
  updateAcUserById,
  deleteAcUserById,
};
