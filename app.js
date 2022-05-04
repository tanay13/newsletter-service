const express = require("express");
const app = express();
const mongoose = require("mongoose");

require("./connections/database");

app.post("/api/addSubs", (req, res) => {
  const { email, topic } = req.body;
});

app.listen(3000, () => {
  console.log("Server running");
});
