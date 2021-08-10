const { Schema } = require("mongoose");
const { getConnection } = require("../helpers/db_connection");

function Db(dbName, schemaInfo) {
  this.connection = getConnection(dbName);
  if (!this.connection) {
    throw new Error(
      `The connection to database ${dbName} is not initialized !`
    );
  }

  if (!schemaInfo) {
    throw new Error("Schema data is invalid !");
  } else if (
    !schemaInfo.name ||
    typeof schemaInfo.name !== "string" ||
    schemaInfo.name === ""
  ) {
    throw new Error("Schema name is invalid !");
  } else if (
    !schemaInfo.schema ||
    schemaInfo.schema instanceof Schema === false
  ) {
    throw new Error("Schema structure is invalid !");
  }

  const { name, schema } = schemaInfo;

  if (
    schemaInfo.autoIncrement &&
    typeof schemaInfo.autoIncrement === "string" &&
    schemaInfo.autoIncrement !== ""
  ) {
    // Check whether the counter record correspond to schema name in Counter Collection is exist or not
    let counterModel = this.connection.models["Counter"];
    if (!counterModel) {
      const counterSchema = new Schema({
        id: {
          type: String,
          required: true,
          unique: true,
        },
        total: {
          type: Number,
          default: 0,
        },
      });
      counterModel = this.connection.model("Counter", counterSchema);
    }
    (async () => {
      try {
        if (counterModel) {
          const counterRecord = await counterModel.exists({ id: name });
          if (!counterRecord) {
            await counterModel.create({
              id: name,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }

  this.model = this.connection.model(name, schema);

  this._getQueryOneId = async function (idQueryObject) {
    const { field, value } = idQueryObject;
    if (!field || typeof field !== "string" || field === "") {
      throw new Error("ID field is invalid !");
    }
    if (typeof value === "undefined" || value === null) {
      throw new Error("ID value is invalid !");
    }
    const query = {
      [field]: value,
    };
    if (
      idQueryObject.otherOptions &&
      Object.keys(idQueryObject.otherOptions).length > 0
    ) {
      Object.keys(idQueryObject.otherOptions).forEach((field) => {
        query[field] = idQueryObject.otherOptions[field];
      });
    }

    const existed = await this.isExist(query);
    if (!existed) {
      let errorMessage = `Cannot found the record with ${field} = ${value}`;

      if (
        idQueryObject.otherOptions &&
        Object.keys(idQueryObject.otherOptions).length > 0
      ) {
        Object.keys(idQueryObject.otherOptions).forEach((field) => {
          errorMessage += `, ${field} = ${idQueryObject.otherOptions[field]}`;
        });
      }
      const notExistError = new Error(`${errorMessage} !`);
      notExistError.code = 404;
      throw notExistError;
    }

    return query;
  };

  this.validateData = function (data) {
    const newDoc = new this.model(data);
    const error = newDoc.validateSync();
    if (error && error.errors && Object.keys(error.errors).length > 0) {
      console.log('validateData ===>', error)
      const firstKey = Object.keys(error.errors)[0];
      error.errors[firstKey].code = 400;
      throw error.errors[firstKey];
    }
  };

  this.isExist = function (params) {
    return this.model.exists(params);
  };

  this.getList = async function (params = {}, opt = {}, projection = null) {
    const result = await this.model.find(params, projection, opt);
    return result;
  };

  this.paginate = async function (query = {}, options = {}) {
    const result = await this.model.paginate(query, options);
    return result;
  };

  this.aggregatePaginate = async function (aggregate, options = {}) {
    const result = await this.model.aggregatePaginate(aggregate, options);
    return result;
  };

  this.aggregate = async function (options) {
    const result = await this.model.aggregate(options);
    return result;
  };

  this.findOne = async function (query) {
    const result = await this.model.findOne(query);
    return result;
  };

  this.getById = async function (id, opt = {}, projection = null) {
    const result = await this.model.findById(id, projection, opt);
    if (!result) {
      const notExistError = new Error(
        `Cannot found the record with id ${id} !`
      );
      notExistError.code = 404;
      throw notExistError;
    }
    return result;
  };

  this.createNew = async function (data) {
    const result = await this.model.create(data);
    return result;
  };

  this.updateById = async function (id, data, opt = {}) {
    const existed = await this.isExist({ _id: id });
    if (!existed) {
      const notExistError = new Error(
        `Cannot found the record with id ${id} !`
      );
      notExistError.code = 404;
      throw notExistError;
    }
    const result = await this.model.findByIdAndUpdate(id, data, {
      ...opt,
      timestamps: true,
    });
    return result;
  };

  this.deleteById = async function (id, opt = {}) {
    const existed = await this.isExist({ _id: id });
    if (!existed) {
      const notExistError = new Error(
        `Cannot found the record with id ${id} !`
      );
      notExistError.code = 404;
      throw notExistError;
    }
    const result = await this.model.findByIdAndDelete(id, opt);
    return result;
  };

  this.updateOneById = async function (idQueryObject, data, opt = {}) {
    const query = await this._getQueryOneId(idQueryObject);

    const result = await this.model.findOneAndUpdate(query, data, {
      ...opt,
      timestamps: true,
    });
    return result;
  };

  this.updateOne = async function (query, data, opt = {}) {

    const result = await this.model.findOneAndUpdate(query, data, {
      ...opt,
      timestamps: true,
    });
    return result;
  };

  this.deleteOneById = async function (idQueryObject, opt = {}) {
    const query = await this._getQueryOneId(idQueryObject);

    const result = await this.model.findOneAndDelete(query, opt);
    return result;
  };

  this.getOneById = async function (
    idQueryObject,
    queryOpt = {},
    projection = null
  ) {
    const query = await this._getQueryOneId(idQueryObject);
    const result = await this.model.findOne(query, projection, queryOpt);
    if (!result) {
      const notExistError = new Error(
        `Cannot found the record with ${idQueryObject.field} is ${idQueryObject.value} !`
      );
      notExistError.code = 404;
      throw notExistError;
    }
    return result;
  };

  this.getOneOrCreate = async function (
    query,
    createData,
    queryOpt = {},
    projection = null
  ) {
    let result = await this.model.findOne(query, projection, queryOpt);
    if (!result) {
      result = await this.createNew(createData);
    }
    return result;
  };

  this.switchStatus = async function (idQueryObject, fieldName, opt = {}) {
    const query = await this._getQueryOneId(idQueryObject);
    const doc = await this.model.findOne(query);
    const newStatus = doc[fieldName] === "n" ? "y" : "n";
    const data = {
      [fieldName]: newStatus,
    };
    const result = await this.model.findOneAndUpdate(query, data, {
      ...opt,
      timestamps: true,
    });
    return result;
  };

  return this;
}

module.exports = Db;
