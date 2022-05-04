require("dotenv").config();

const mongoose = require("mongoose");

const url = process.env.MONGO;

console.log(url);

mongoose.connect(url, () => {
  console.log("Database connected");
});
