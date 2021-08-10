const TimelineRoute = require('express').Router();
const {
  getListTimeline,
  createTimeline,
  updateTimelineById,
  deleteTimelineById,
  getTimelineDetail,
} = require('./controller');

TimelineRoute.post('/', createTimeline);
TimelineRoute.get('/list', getListTimeline);
TimelineRoute.get('/:id', getTimelineDetail);
TimelineRoute.put('/:id', updateTimelineById);
TimelineRoute.delete('/:id', deleteTimelineById);

module.exports = TimelineRoute;
