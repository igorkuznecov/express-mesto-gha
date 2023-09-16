const users = require("express").Router();
const { findAllUsers, findUserById, createUser, updateUserInfo, updateUserAvatar} = require('../controllers/users.js')

users.get('/', findAllUsers);
users.get('/:userId', findUserById);
users.post('/', createUser);
users.patch('/me', updateUserInfo);
users.patch('/me/avatar', updateUserAvatar);

module.exports = users;

