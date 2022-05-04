const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Topic = require("./models/Topic");
const Content = require("./models/Content");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("./connections/database");
const { client, redisConnection } = require("./connections/redis");

redisConnection();

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

    const latestTime = await client.get("latestTime");
    const contentDateTime = new Date(contentTime);
    const latestDateTime = new Date(latestTime);

    if (latestTime === null || contentDateTime < latestDateTime) {
      // Adding keys in the redis db

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
