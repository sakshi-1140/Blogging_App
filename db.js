const mongoose = require("mongoose");
const clc = require("cli-color");

//db connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>console.log(clc.yellowBright.bold("mongodb connected successfully")))
  .catch((error) => console.log(clc.redBright(error)));
