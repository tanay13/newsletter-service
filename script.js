const { client, redisConnection } = require("./connections/redis");
const nodemailer = require("nodemailer");
const Topic = require("./models/Topic");
const Content = require("./models/Content");
require("./connections/database");
redisConnection();

console.log(process.env.EMAIL);
console.log(process.env.PASSWORD);

async function scheduledMail() {
  const currTime = new Date();

  const latestScheduledMail = await client.get("latestTime");
  const latestText = await client.get("latestData");
  const latestId = await client.get("latestId");
  const latestTopic = await client.get("latestTopic");

  if (
    latestScheduledMail === null ||
    latestText === null ||
    latestId === null ||
    latestTopic === null
  )
    return;

  const latestTime = new Date(latestScheduledMail);

  if (currTime === latestTime || currTime > latestTime) {
    // send mail
    try {
      const topics = await Topic.find({ topic: latestTopic });

      for (var i = 0; i < topics[0].subscribers.length; i++) {
        let transporter = nodemailer.createTransport({
          service: "hotmail",
          auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
          },
        });

        let message = {
          from: process.env.EMAIL,
          to: topics[0].subscribers[i],
          subject: "Subject",
          text: latestText,
        };

        transporter.sendMail(message, function (err, info) {
          if (err) {
            console.log(err);
          } else {
            console.log("Email sent");
          }
        });
      }

      // deleting the post

      await Content.findByIdAndDelete(latestId);

      console.log("Deleted");

      // set the "latestTime" key to next latest time"

      const c = await Content.find().sort({ contentTime: 1 });

      if (c.length === 0) {
        client.del("latestTime");
        client.del("latestData");
        client.del("latestId");
        client.del("latestTopic");
        return;
      }

      await client.set("latestTime", c[0].contentTime.toISOString());
      await client.set("latestData", c[0].contentText);
      await client.set("latestId", c[0].id);
      await client.set("latestTopic", c[0].topic);
    } catch (e) {
      console.log(e);
    }
  }
}

setInterval(() => {
  console.log("Script Running...");
  scheduledMail();
}, 60000);
