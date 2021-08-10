const admin = require('firebase-admin')

const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'your-database-url-here'
});

const messaging = admin.messaging();

module.exports = {
  messaging
}