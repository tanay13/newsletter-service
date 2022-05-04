require("dotenv").config();

const mongoose = require("mongoose");

const url = process.env.MONGO;

mongoose.connect(url, () => {
  console.log("Database connected");
});
