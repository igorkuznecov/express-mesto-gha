const cards = require("express").Router();
const {
  findAllCards,
  findCardById,
  createCard,
  deleteCardById,
  setLike,
  deleteLike,
} = require("../controllers/cards.js");

cards.get("/", findAllCards);
cards.get("/:cardId", findCardById);
cards.post("/", createCard);
cards.delete("/:cardId", deleteCardById);
cards.put("/:cardId/likes", setLike);
cards.delete("/:cardId/likes", deleteLike);

module.exports = cards;
