const Card = require("../models/cards.js");

module.exports.findAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) =>
      res.status(500).send({ message: `Произошла ошибка: ${err}` })
    );
};

module.exports.findCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      res.status(404).send({ message: `Карточки с таким идентификатором не существует` });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: `Неверный идентификатор карточки` });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(400)
          .send({ message: `Переданы некорректные данные` });
      }
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.deleteCardById = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(() => {
      Card.find({}).then((cards) => res.send(cards));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: `Неверный идентификатор карточки` });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.setLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet:{ likes: req.user._id }}, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: `Неверный идентификатор карточки` });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};

module.exports.deleteLike = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull:{ likes: req.user._id }}, { new: true })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: `Неверный идентификатор карточки` });
        return;
      }
      res.status(500).send({ message: `Произошла ошибка: ${err}` });
    });
};
