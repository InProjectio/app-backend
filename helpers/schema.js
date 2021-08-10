const { Schema, connections } = require('mongoose');

const RefType = (refPath, rest = {}) => ({
  type: Schema.Types.ObjectId,
  ref: refPath,
  ...rest,
});

const EnumType = (type, enumValues, rest = {}) => ({
  type,
  enum: enumValues,
  ...rest,
});

const StringType = (
  required = false,
  unique = false,
  index = false,
  rest = {}
) => ({
  type: String,
  required,
  unique,
  index,
  ...rest,
});

const CharType = (
  length = 1,
  required = false,
  unique = false,
  index = false,
  rest = {}
) => ({
  type: String,
  min: length,
  max: length,
  required,
  unique,
  index,
  ...rest,
});

const NumberType = (
  required = false,
  unique = false,
  index = false,
  rest = {}
) => ({
  type: Number,
  required,
  unique,
  index,
  ...rest,
});

const AutoIncrementIdType = (rest = {}) => ({
  type: Number,
  required: false,
  unique: true,
  index: true,
  ...rest,
  immutable: true,
});

const DateType = (required = false, index = false) => ({
  type: Date,
  required,
  index,
});

const exportSchema = (name, schema, rest = {}) => {
  if (typeof name !== 'string' || name === '') {
    throw new Error(`Schema name is invalid !`);
  } else if (schema instanceof Schema === false) {
    throw new Error(`Schema is not schema type !`);
  }

  return {
    name,
    schema,
    ...rest,
  };
};

module.exports = {
  RefType,
  StringType,
  EnumType,
  CharType,
  DateType,
  exportSchema,
  NumberType,
  AutoIncrementIdType,
};
