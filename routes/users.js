const users = require('express').Router();
const { celebrate, Joi, errors } = require('celebrate');
const {
  findAllUsers,
  findUserById,
  updateUserInfo,
  updateUserAvatar,
  me,
} = require('../controllers/users');

users.get('/', findAllUsers);
users.get('/me', me);

users.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().alphanum().length(24),
    }),
  }),
  findUserById,
);

users.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateUserInfo,
);

users.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri().min(2).max(30),
    }),
  }),
  updateUserAvatar,
);

users.use(errors());
module.exports = users;
