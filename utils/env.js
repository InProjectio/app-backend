const loadEnvVariables = (stage) => {
  if (stage === 'localhost') {
    require('dotenv').config({
      path: './configs/envs/.env.localhost',
    });
  } else if (stage === 'development') {
    require('dotenv').config({
      path: './configs/envs/.env.development',
    });
  } else if (stage === 'staging') {
    require('dotenv').config({
      path: './configs/envs/.env.staging',
    });
  } else if (stage === 'production') {
    require('dotenv').config({
      path: './configs/envs/.env.production',
    });
  }
};

module.exports = {
  loadEnvVariables,
};
