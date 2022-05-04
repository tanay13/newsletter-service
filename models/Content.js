const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  contentText: String,
  contentTime: Date,
  topic: String,
});

const Content = mongoose.model("Content", contentSchema);

module.exports = Content;
