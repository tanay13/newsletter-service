const redis = require("redis");
const client = redis.createClient(process.env.HOST, process.env.PORT);

async function redisConnection() {
  try {
    await client.connect();
    console.log("Redis connected");
  } catch (e) {
    console.log(e);
  }
}

module.exports = { client, redisConnection };
