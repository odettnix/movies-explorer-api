require('dotenv').config();

const JWT_SECRET_DEV = 'OhNoThisIsSecretKey';
const { DB_ADDRESS = 'mongodb://127.0.0.1:27017/movies' } = process.env;
const { PORT = '3000' } = process.env;

const {
  NODE_ENV,
  JWT_SECRET,
} = process.env;

module.exports = {
  NODE_ENV, JWT_SECRET, JWT_SECRET_DEV, DB_ADDRESS, PORT,
};
