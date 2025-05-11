const success = (result, statusCode = 200) => {
  return {
    status: "ok",
    statusCode,
    result,
  };
};

const failure = (message, statusCode = 500) => {
  return {
    status: "error",
    statusCode,
    message,
  };
};

module.exports = {
  success,
  failure,
};
