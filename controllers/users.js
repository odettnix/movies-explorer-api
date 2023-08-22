const bcrypth = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConfilctError = require('../errors/ConfilctError');
const { NODE_ENV, JWT_SECRET, JWT_SECRET_DEV } = require('../utils/constants');

function createUser(req, res, next) {
  const { name, email, password } = req.body;
  bcrypth.hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.send({
      name: user.name,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConfilctError('Пользователь с таким электронным адресом уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
}

function login(req, res, next) {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!email || !password) {
        return next(new BadRequestError('Неправильные почта или пароль'));
      }
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : JWT_SECRET_DEV, { expiresIn: '7d' });
      return res.send({ token });
    })
    .catch(next);
}

function getCurrentUser(req, res, next) {
  const { _id } = req.user;
  User
    .findById(_id).then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с таким id не найден'));
      }
      return res.send(user);
    }).catch(next);
}

function updateUser(req, res, next) {
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    { new: true, runValidators: true },
  ).then((user) => {
    res.send(user);
  }).catch((err) => {
    if (err.name === 'ValidationError' || err.name === 'CastError') {
      next(new BadRequestError('Переданы некорректные данные при обновлении профиля пользователя'));
    }
    return next(err);
  });
}

module.exports = {
  createUser, login, getCurrentUser, updateUser,
};
