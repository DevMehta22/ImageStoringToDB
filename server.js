require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const router = require("./Routes/imgRoutes");

const app = express();

app.use(express.json());
app.set("view engine", "ejs");
app.use("", router);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to DB!");
    const port = process.env.PORT || 4000;
    app.listen(port, (err) => {
      if (err) throw err.message;
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
