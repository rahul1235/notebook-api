const formatValidationError = (options) => {
  const { check } = options;
  return check.map((element) => {
    const tempObj = {};
    const key = element.field;
    tempObj[key] = element.message;
    return tempObj;
  });
};

module.exports = {
  formatValidationError,
};
