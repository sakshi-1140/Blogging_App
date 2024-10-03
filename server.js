const express = require("express");
const clc = require("cli-color");
require("dotenv").config();
const session = require('express-session');
const mongodbSession= require('connect-mongodb-session')(session)

//fileimports
const db = require('./db');
const authRouter = require('./routers/authRouter');
const blogRouter = require("./routers/blogRouter");
const isAuth = require("./middlewares/isAuthMiddleware");

const app = express();
const PORT = process.env.PORT || 8000;
const store = new mongodbSession({
  uri:process.env.MONGO_URI,
  collection:"sessions",
})

//middleware
app.use(express.json()); //body parser
app.use(session({
  secret:process.env.SECRET_KEY,
  store:store,
  resave:false,
  saveUninitialized:false,
}))
app.use('/auth',authRouter);
app.use('/blog',isAuth, blogRouter)


app.listen(PORT, () => {
  console.log(clc.yellow(`Server is runnning at: `));
  console.log(clc.yellowBright.underline.bold(`http://localhost:${PORT}`));
});
