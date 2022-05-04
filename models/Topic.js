const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  topic: String,
  subscribers: [String],
});

const Topic = mongoose.model("Topic", topicSchema);

module.exports = Topic;
