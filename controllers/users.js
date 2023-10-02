const User = require("../models/users.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
      const err = new Error("Пользователя с таким ID не существует");
      err.statusCode = 404;
      next(err);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const err = new Error("Неверный ID пользователя");
        err.statusCode = 404;
        return next(err);
      }
      next(err);
    });
};

module.exports.me = (req, res, next) => {
  console.log(req.user._id);
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      const err = new Error("Пользователя с таким ID не существует");
      err.statusCode = 404;
      next(err);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const err = new Error("Неверный ID пользователя");
        err.statusCode = 404;
        return next(err);
      }
      next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) =>
      res.send({
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        id: user._id,
      })
    )
    .catch((err) => {
      if (err.name === "ValidationError") {
        const err = new Error("Переданы некорректные данные");
        err.statusCode = 400;
        next(err);
      }
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name: name, about: about },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        const err = new Error("Переданы некорректные данные");
        err.statusCode = 400;
        next(err);
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar: avatar }, { new: true })
    .then((user) => {
      if (avatar) {
        return res.send({ data: user });
      }
      const err = new Error("Переданы некорректные данные");
      err.statusCode = 400;
      next(err);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const err = new Error("Переданы некорректные данные");
        err.statusCode = 400;
        next(err);
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, "super-strong-secret", {
          expiresIn: "7d",
        }),
      });
    })
    .catch((err) => {
      if (err.message === "Неправильные почта или пароль") {
        const err = new Error("Неправильные почта или пароль");
        err.statusCode = 401;
        next(err);
      }
      next(err);
    });
};
