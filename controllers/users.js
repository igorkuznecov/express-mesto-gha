const User = require("../models/users.js");

module.exports.findAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка: ${err}` })
    );
};

module.exports.findUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        return res.send({ data: user });
      }
      res.status(404).send({
        message: `Пользователя с таким идентификатором не существует`,
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({ message: `Неверный идентификатор пользователя` });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: `Переданы некорректные данные` });
      }
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name: name, about: about },
    { new: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: `Переданы некорректные данные` });
      }
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar: avatar }, { new: true })
    .then((user) => {
      if (avatar) {
        return res.send({ data: user });
      }
      res.status(400).send({ message: `Переданы некорректные данные` });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: `Переданы некорректные данные` });
      }
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};
