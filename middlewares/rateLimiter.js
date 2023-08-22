// eslint-disable-next-line import/no-extraneous-dependencies
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 150,
  message: 'В данный момент превышено число запросов. Пожалуйста, повторите попытку позже',
});

module.exports = limiter;
