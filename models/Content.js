const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  contentText: String,
  contentTime: Date,
});

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;
