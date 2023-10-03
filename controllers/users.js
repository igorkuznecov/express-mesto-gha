const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const UnauthorizedError = require('../errors/unauthorized-err')

module.exports.findAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.findUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NotFoundError('Пользователя с таким ID не существует');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const err = new BadRequestError('Неверный ID пользователя');
        return next(err);
      }
      return next(err);
    });
};

module.exports.me = (req, res, next) => {
  console.log(req.user._id);
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      throw new NotFoundError('Пользователя с таким ID не существует');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        const err = new BadRequestError('Неверный ID пользователя');
        return next(err);
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        const err = new ConflictError('Пользователя с таким ID не существует');
        return next(err);
      }
      if (err.name === 'ValidationError') {
        const err = new BadRequestError('Переданы некорректные данные');
        return next(err);
      }
      return next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const err = new BadRequestError('Переданы некорректные данные');
        return next(err);
      }
      return next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true })
    .then((user) => {
      if (avatar) {
        return res.send({ data: user });
      }
      throw new BadRequestError('Переданы некорректные данные');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const err = new BadRequestError('Переданы некорректные данные');
        next(err);
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'super-strong-secret', {
          expiresIn: '7d',
        }),
      });
    })
    .catch((err) => {
      return next(err);
    });
};
