const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const {
  urlNotFoundHandler,
  requestHandler,
} = require("../helpers/request_handlers");
const { loadEnvVariables } = require("./env");
const { createConnection } = require("../helpers/db_connection");

const stage = process.argv[2] || "localhost";
loadEnvVariables(stage);

// Initial default database connection
createConnection(process.env.DB_URL, process.env.DB_NAME);

module.exports = (mainRoute) => {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.use(mainRoute);

  app.use(urlNotFoundHandler);
  app.use(requestHandler);

  return app;
};
