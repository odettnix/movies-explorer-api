const JWT_SECRET_DEV = 'OhNoThisIsSecretKey';

const {
  NODE_ENV,
  JWT_SECRET,
} = process.env;

module.exports = {
  NODE_ENV, JWT_SECRET, JWT_SECRET_DEV,
};
