const mongoose = require("mongoose");

const createConnection = (
  URL,
  dbName,
  opt = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
) => {
  const connection = mongoose.createConnection(URL, { dbName, ...opt });
  connection.on("error", function (error) {
    console.error("error", error);
  });
  connection.on("open", function () {
    console.log(`[${process.env.STAGE}] Database ${this.name} is connected !`);
  });
  return connection;
};

const getConnection = (name) => {
  return mongoose.connections.find((connect) => connect.name === name);
};

module.exports = {
  createConnection,
  getConnection,
};
