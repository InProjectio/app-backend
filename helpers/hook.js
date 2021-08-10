const { Schema, connections } = require('mongoose');

const setAutoIncrement = (
  schema,
  schemaName,
  fieldName,
  dbName = process.env.DB_NAME
) => {
  if (schema instanceof Schema === false) {
    throw new Error(`Schema is invalid !`);
  }
  if (typeof fieldName !== 'string' || fieldName === '') {
    throw new Error('Field name is invalid !');
  }
  if (typeof dbName !== 'string' || dbName === '') {
    throw new Error('DB name is invalid !');
  }
  schema.pre('save', async function (next) {
    if (this.isNew) {
      const connection = connections.find((con) => con.name === dbName);
      if (connection) {
        const counterModel = connection.models['Counter'];
        if (counterModel) {
          const counterData = await counterModel.findOne({ id: schemaName });
          const newId = counterData.total + 1;
          await counterData.update({ $inc: { total: 1 } });
          this[fieldName] = newId;
        }
      }
    }
    next();
  });
};

module.exports = {
  setAutoIncrement,
};
