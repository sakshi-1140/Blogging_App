const express = require("express");
const clc = require("cli-color");
require("dotenv").config();

//fileimports
const db = require('./db');
const authRouter = require('./routers/authRouter');

const app = express();
const PORT = process.env.PORT || 8000;

//middleware
app.use('/auth',authRouter);

app.listen(PORT, () => {
  console.log(clc.yellow(`Server is runnning at: `));
  console.log(clc.yellowBright.underline.bold(`http://localhost:${PORT}`));
});
