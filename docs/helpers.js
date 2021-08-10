const faker = require('faker');
const mongoTypes = require('mongoose').Types;

// Add 2 more functions to global Object

if (!Object.prototype.withDescription) {
  Object.prototype.withDescription = function (description) {
    this.description = description;
    return this;
  };
}

if (!Object.prototype.withExample) {
  Object.prototype.withExample = function (exampleValue) {
    this.example = exampleValue;
    return this;
  };
}

// Generate data type object

// const genKey = () => ({
//   type: 'string',
//   pattern: '^[a-f\\d]{24}$',
//   example: mongoTypes.ObjectId(),
// });

const genKey = () => ({
  type: 'number',
  example: 1,
});

const genFloat = () => ({
  type: 'number',
  format: 'float',
});

const genDouble = () => ({
  type: 'number',
  format: 'double',
});

const genInteger = () => ({
  type: 'integer',
  format: 'int32',
});

const genEnum = (type, values) => ({
  type,
  enum: values,
});

const genLongNumber = () => ({
  type: 'integer',
  format: 'int64',
});

const genChar = (length = 1) => ({
  type: 'string',
  minLength: length,
  maxLength: length,
});

const genVarchar = (maxLength = 255, minLength = 0) => ({
  type: 'string',
  minLength,
  maxLength,
});

const genTimestamp = () => ({
  type: 'string',
  type: 'date-time',
  example: faker.datatype.datetime(),
});

const genObjectType = (properties) => ({
  type: 'object',
  properties,
});

const genObjectOfArrayOfObject = (rootField, properties) => ({
  type: 'object',
  properties: {
    [rootField]: {
      type: 'array',
      items: {
        type: 'object',
        properties,
      },
    },
  },
});

const genObjectOfArrayOfCustomType = (rootField, type, { ...rest }) => ({
  type: 'object',
  properties: {
    [rootField]: {
      type: 'array',
      items: {
        ...rest,
        type,
      },
    },
  },
});

const genArrayOfObject = (properties) => ({
  type: 'array',
  items: {
    type: 'object',
    properties,
  },
});

const genArrayOfCustomType = (type, rest = {}) => ({
  type: 'array',
  items: {
    type,
    ...rest,
  },
});

// Generate success response data object
const genSuccessRes = (schemaRef, type = 'object') => {
  const response = {
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            data: {
              type,
            },
          },
        },
      },
    },
  };
  if (type === 'object') {
    response['content']['application/json']['schema']['properties']['data'][
      '$ref'
    ] = schemaRef;
  } else if (type === 'array') {
    response['content']['application/json']['schema']['properties']['data'][
      'items'
    ] = {
      $ref: schemaRef,
    };
  }
  return response;
};

// Generate fail response data object
const genFailRes = (code, message) => ({
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          code: {
            type: 'integer',
            example: code,
          },
          message: {
            type: 'string',
            example: message,
          },
        },
      },
    },
  },
});

// Generate request body data object
const genRequestBody = (refPath, required = false, ...rest) => ({
  required,
  content: {
    'application/json': {
      schema: {
        $ref: refPath,
      },
    },
  },
});

const genRequestFormBody = (refPath, required = false, ...rest) => ({
  required,
  content: {
    'multipart/form-data': {
      schema: {
        $ref: refPath,
      },
    },
  },
});

// Generate parameter item data object
const genParameterItem = (
  name,
  schemaRef,
  description = '',
  required = true,
  whereIn = 'path'
) => {
  if (typeof schemaRef === 'string' && schemaRef !== '') {
    return {
      required,
      in: whereIn,
      name,
      description,
      schema: {
        $ref: schemaRef,
      },
    };
  }
  return {
    required,
    in: whereIn,
    name,
    description,
    schema: {
      ...schemaRef,
    },
  };
};
const userTokenAuth = {
  required: true,
  in: 'header',
  name: 'user_token',
  description: 'User token after login successful',
  schema: {
    type: 'string',
  },
};

// Generate data object to apply to path
const genPathData = (pathName) => {
  const INFO_SCHEMA = `#/components/schemas/${pathName}Info`;
  const ID_SCHEMA = `#/components/schemas/${pathName}ID`;
  const NEW_INPUT_SCHEMA = `#/components/schemas/${pathName}NewInput`;
  const UPDATE_INPUT_SCHEMA = `#/components/schemas/${pathName}UpdateInput`;

  const genDefaultRes = (successDataType = 'object') => ({
    200: genSuccessRes(INFO_SCHEMA, successDataType),
    500: genFailRes(500, 'Something went wrong !'),
  });

  const genCustomRes = (customPath, successDataType = 'object') => ({
    200: genSuccessRes(
      `#/components/schemas/${customPath}Info`,
      successDataType
    ),
    500: genFailRes(500, 'Something went wrong !'),
  });

  const getCustomSchemaRef = (name) =>
    `#/components/schemas/${pathName}${name}`;

  const genCustomResFromCustomRef = (
    customRefPath,
    successDataType = 'object'
  ) => ({
    200: genSuccessRes(customRefPath, successDataType),
    500: genFailRes(500, 'Something went wrong !'),
  });

  const statusResponse = {
    200: genSuccessRes(null, 'boolean'),
    500: genFailRes(500, 'Something went wrong !'),
  };

  const txhashResponse = {
    200: genSuccessRes(null, 'string'),
    500: genFailRes(500, 'Something went wrong !'),
  };

  const foreignKey = {
    200: genSuccessRes(null, 'integer'),
    500: genFailRes(500, 'Something went wrong !'),
  };

  return {
    INFO_SCHEMA,
    ID_SCHEMA,
    NEW_INPUT_SCHEMA,
    UPDATE_INPUT_SCHEMA,
    genDefaultRes,
    statusResponse,
    txhashResponse,
    foreignKey,
    genCustomRes,
    getCustomSchemaRef,
    genCustomResFromCustomRef,
  };
};

const genPathRouteObject = (sourceObject, pathName) => ({
  [`${pathName}`]: sourceObject[`${pathName}`],
  [`${pathName}/list`]: sourceObject[`${pathName}/list`],
  [`${pathName}/{id}`]: sourceObject[`${pathName}/{id}`],
});

const genPathRouteObjectV2 = (sourceObject, pathName) => {
  return Object.keys(sourceObject).reduce((rs, key) => {
    const path = `/${pathName}${key === '/' ? '' : key}`;
    const pathValue = sourceObject[key];
    rs[path] = pathValue;
    return rs;
  }, {});
};

const genSchemaSkeleton = function (schemaName) {
  const result = {
    [`${schemaName}Info`]: null,
    [`${schemaName}ID`]: null,
    [`${schemaName}NewInput`]: null,
    [`${schemaName}UpdateInput`]: null,
  };

  this.setID = (schemaObj) => {
    result[`${schemaName}ID`] = schemaObj;
    return this;
  };

  this.setNewInput = (schemaObj) => {
    result[`${schemaName}NewInput`] = schemaObj;
    return this;
  };

  this.setUpdateInput = (schemaObj) => {
    result[`${schemaName}UpdateInput`] = schemaObj;
    return this;
  };

  this.setInfo = (schemaObj) => {
    result[`${schemaName}Info`] = {
      _id: genKey(),
      ...schemaObj,
      block_id: genKey(),
      create_at: genTimestamp(),
      update_at: genTimestamp(),
    };
    return this;
  };

  this.setCustomSchema = (name, schemaObj) => {
    result[`${schemaName}${name}`] = { ...schemaObj };
    return this;
  };

  this.done = () => result;

  return this;
};

const genAuthRequest = (tags, summary, { ...rest }) => ({
  tags,
  summary,
  security: [
    {
      UserToken: [],
    },
  ],
  ...rest,
});

const genNonAuthRequest = (tags, summary, { ...rest }) => ({
  tags,
  summary,
  ...rest,
});

module.exports = {
  genAuthRequest,
  genNonAuthRequest,
  genKey,
  genChar,
  genVarchar,
  genFloat,
  genDouble,
  genInteger,
  genEnum,
  genLongNumber,
  genTimestamp,
  genObjectType,
  genSuccessRes,
  genFailRes,
  genRequestBody,
  genParameterItem,
  genPathData,
  genPathRouteObject,
  genSchemaSkeleton,
  genPathRouteObjectV2,
  genObjectOfArrayOfObject,
  userTokenAuth,
  genObjectOfArrayOfCustomType,
  genArrayOfObject,
  genArrayOfCustomType,
  genRequestFormBody,
};
