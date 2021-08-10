const DB = require('../../utils/db');
const schemaInfo = require('./schema');

const TimelineModel = new DB(process.env.DB_NAME, schemaInfo);

const list = async () => {
  const timelineList = await TimelineModel.getList();
  return timelineList;
};

const detail = async (id) => {
  const timelineDetail = await TimelineModel.getById(id);
  return timelineDetail;
};

const add = async (data) => {
  TimelineModel.validateData(data);
  const newTimeline = await TimelineModel.createNew(data);
  return newTimeline;
};

const updateById = async (id, data) => {
  const updatedTimeline = await TimelineModel.updateById(id, data, {
    lean: true,
    new: true,
  });
  return updatedTimeline;
};

const deleteById = async (id) => {
  const deletedTimeline = await TimelineModel.deleteById(id, {
    lean: true,
  });
  return deletedTimeline;
};

module.exports = {
  list,
  add,
  updateById,
  deleteById,
  detail,
};
