const manejarError = (message, errorCode) => {
  const error = new Error();
  error.message = message;
  error.statusCode = errorCode;
  throw error;
};

module.exports = {
  manejarError
}