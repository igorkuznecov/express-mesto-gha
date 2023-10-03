const Card = require("../models/cards");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");
const BadRequestError = require("../errors/bad-request-err");

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
      throw new NotFoundError("Карточка с таким ID не найдена");
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const err = new BadRequestError("Неверный ID карточки");
        return next(err);
      }
      return next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        const err = new BadRequestError("Переданы некорректные данные");
        return next(err);
      }
      return next(err);
    });
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка с таким ID не найдена");
      }
      if (card.owner && !card.owner.equals(req.user._id)) {
        throw new ForbiddenError("Это не ваша карточка");
      }

      Card.deleteOne(card).then(() =>
        Card.find({}).then((cards) => res.send(cards))
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const err = new BadRequestError("Неверный ID карточки");
        return next(err);
      }
      return next(err);
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
      throw new NotFoundError("Карточка с таким ID не найдена");
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const err = new BadRequestError("Неверный ID карточки");
        return next(err);
      }
      return next(err);
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
      throw new NotFoundError("Карточка с таким ID не найдена");
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const err = new BadRequestError("Неверный ID карточки");
        return next(err);
      }
      return next(err);
    });
};
