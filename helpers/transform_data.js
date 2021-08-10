module.exports.cvtToNumber = (data) =>
  isNaN(parseInt(data)) ? data : parseInt(data);

module.exports.cvtArrayToObject = (array, fieldKey) => {
  let result = {};
  if (Array.isArray(array) && array.length > 0) {
    result = array.reduce((rs, item) => {
      const key = item[fieldKey];
      if (key && !rs[key]) {
        rs[key] = { ...item };
      }
      return rs;
    }, {});
  }
  return result;
};
