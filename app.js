const path = require('path');
const mongoose = require("mongoose");
const { PORT = 3000 } = process.env;
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

mongoose.connect("mongodb://localhost:27017/mestodb", {
   useNewUrlParser: true,
}).then(() => {
  console.log('Connected to DB')
})

app.use((req, res, next) => {
  req.user = {
    _id: '650595f444fa5c487723c327'
  };

  next();
});

app.use('/users', require('./routes/users.js'));
app.use('/cards', require('./routes/cards.js'));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});