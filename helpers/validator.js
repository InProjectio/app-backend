module.exports.isEmptyString = (str) =>
  str && typeof str === 'string' && str === '' ? true : false;

module.exports.isNumber = (num) =>
  num && isNaN(parseInt(num)) === false ? true : false;
