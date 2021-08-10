const servers = require('./servers');
const paths = require('./paths');
const components = require('./components');
const tags = require('./tags');

module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Project Name',
    description: '',
    version: '1.0.0',
  },
  servers,
  paths,
  components,
  schemes: ['http', 'https'],
};
