const mongoose = require("mongoose");
const { PORT = 3000 } = process.env;
const express = require("express");
const app = express();
const { login, createUser } = require("./controllers/users");
const authChecker = require("./middlewares/auth");
const errorHandler = require("./middlewares/error");
const { celebrate, Joi, errors } = require("celebrate");

mongoose
  .connect("mongodb://localhost:27017/mestodb", {
    useNewUrlParser: true,
    autoIndex: true,
  })
  .then(() => {
    console.log("Connected to DB");
  });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().email({ tlds: { allow: false } }).required(),
      password: Joi.string().min(2).max(30).required(),
    }),
  }),
  login
);

app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().alphanum().min(2).max(30),
      about: Joi.string().alphanum().min(2).max(30),
      avatar: Joi.string().uri(),
      email: Joi.string().email().required(),
      password: Joi.string().min(2).max(30).required(),
    }),
  }),
  createUser
);

app.use(authChecker);

app.use("/users", require("./routes/users.js"));
app.use("/cards", require("./routes/cards.js"));

app.use("*", (req, res, next) => {
  const err = new Error("Страница не найдена");
  err.statusCode = 404;
  next(err);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use(errors());
app.use(errorHandler);
