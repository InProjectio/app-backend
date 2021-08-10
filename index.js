const http = require('http');
const appWithRoute = require('./utils/app');
const mainRoute = require('./route');
const PORT = process.env.PORT;
const app = appWithRoute(mainRoute);
const { messaging } = require('./helpers/firebaseInit')
require('./jobs/pushNotificationJob')
const moment = require('moment')

console.log('date', new Date(), moment().unix(), moment().format('DD/MM/YYYY HH:mm'))

// console.log(messaging)
// const { getTaskByStatus } = require('./combine_operations/task');

// getTaskByStatus();
const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
  console.log(`Server is running on ${process.env.SERVER_DOMAIN}`);
});
