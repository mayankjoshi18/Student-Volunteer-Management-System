const log = (message, level = 'info') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}]: ${message}`);
};

const error = (message, err = null) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [ERROR]: ${message}`);
  if (err && err.stack) {
    console.error(err.stack);
  }
};

module.exports = {
  log,
  error,
};
