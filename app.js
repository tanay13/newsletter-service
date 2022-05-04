const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Topic = require("./models/Topic");
const Content = require("./models/Content");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("./connections/database");
const { client, redisConnection } = require("./connections/redis");

redisConnection();

app.post("/api/getData", async (req, res) => {
  // const c = await Content.find().sort({ contentTime: 1 });
  // console.log(c[0]);

  const topics = await Topic.find({ topic: "nutrition" });

  console.log(topics);

  for (var i = 0; i < topics[0].subscribers.length; i++) {
    console.log(topics[0].subscribers[i]);
  }
});

app.post("/api/addSubs", async (req, res) => {
  const { email, topic } = req.body;
  try {
    const doc = await Topic.find({ topic });
    if (doc.length == 0) {
      const topicDoc = await Topic.create({
        topic: topic,
        subscribers: [email],
      });
      return;
    }
    doc[0].subscribers.push(email);
    await doc[0].save();
  } catch (e) {
    console.log(e);
  }
});

app.post("/api/addContent", async (req, res) => {
  const { contentText, contentTime, topic } = req.body;

  try {
    const contentDoc = await Content.create({
      contentText,
      contentTime: new Date(contentTime),
      topic,
    });
    console.log("Content Saved");
    //if contentTime is less than the value stored in redis then update the redis value
    const latestTime = await client.get("latestTime");
    const contentDateTime = new Date(contentTime);
    console.log(contentDateTime);
    const latestDateTime = new Date(latestTime);
    console.log(latestDateTime);
    if (latestTime === null || contentDateTime < latestDateTime) {
      await client.set("latestTime", contentDateTime.toISOString());
      await client.set("latestData", contentText);
      await client.set("latestId", contentDoc.id);
      await client.set("latestTopic", contentDoc.topic);
    }
  } catch (e) {
    console.log(e);
  }
});

app.listen(3000, () => {
  console.log("Server running");
});
