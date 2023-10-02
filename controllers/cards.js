const Card = require("../models/cards.js");

module.exports.findAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.findCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      const err = new Error("Карточка с таким ID не найдена");
      err.statusCode = 404;
      next(err);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const err = new Error("Неверный ID карточки");
        err.statusCode = 400;
        return next(err);
      }
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        const err = new Error("Переданы некорректные данные");
        err.statusCode = 400;
        return next(err);
      }
      next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        const err = new Error("Карточка с таким ID не найдена");
        err.statusCode = 404;
        return next(err);
      }
      if (card.owner && !card.owner.equals(req.user._id)) {
        const err = new Error("Это не ваша карточка");
        err.statusCode = 409;
        return next(err);
      }

      Card.findByIdAndRemove(req.params.cardId).then(() =>
        Card.find({}).then((cards) => res.send(cards))
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const err = new Error("Неверный ID карточки");
        err.statusCode = 400;
        return next(err);
      }
      next(err);
    });
};

module.exports.setLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      const err = new Error("Карточка с таким ID не найдена");
      err.statusCode = 404;
      next(err);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const err = new Error("Неверный ID карточки");
        err.statusCode = 400;
        return next(err);
      }
      next(err);
    });
};

module.exports.deleteLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (card) {
        return res.send({ data: card });
      }
      const err = new Error("Карточка с таким ID не найдена");
      err.statusCode = 404;
      next(err);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const err = new Error("Неверный ID карточки");
        err.statusCode = 400;
        return next(err);
      }
      next(err);
    });
};
