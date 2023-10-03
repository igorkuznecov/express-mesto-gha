const cards = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');

const {
  findAllCards,
  findCardById,
  createCard,
  deleteCardById,
  setLike,
  deleteLike,
} = require('../controllers/cards');

cards.get('/', findAllCards);

cards.get(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  findCardById,
);

cards.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().min(2),
    }),
  }),
  createCard,
);

cards.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  deleteCardById,
);

cards.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  setLike,
);

cards.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().alphanum().length(24),
    }),
  }),
  deleteLike,
);

cards.use(errors());

module.exports = cards;
