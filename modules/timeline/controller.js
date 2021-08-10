const { list, add, updateById, deleteById, detail } = require('./model');

const getListTimeline = async (req, res, next) => {
  try {
    const result = await list();
    next(result);
  } catch (error) {
    next(error);
  }
};

const getTimelineDetail = async (req, res, next) => {
  try {
    const timelineId = req.params.id;
    const result = await detail(timelineId);
    next(result);
  } catch (error) {
    next(error);
  }
};

const createTimeline = async (req, res, next) => {
  try {
    const result = await add(req.body);
    next(result);
  } catch (error) {
    next(error);
  }
};

const updateTimelineById = async (req, res, next) => {
  try {
    const timelineId = req.params.id;
    const data = req.body;
    const result = await updateById(timelineId, data);
    next(result);
  } catch (error) {
    next(error);
  }
};

const deleteTimelineById = async (req, res, next) => {
  try {
    const timelineId = req.params.id;
    const result = await deleteById(timelineId);
    next(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListTimeline,
  getTimelineDetail,
  createTimeline,
  updateTimelineById,
  deleteTimelineById,
};
