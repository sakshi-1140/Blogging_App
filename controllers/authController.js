const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { userDataValidate } = require("../utils/authUtils");

const registerController = async (req, res) => {
  //data validation
  //check if email and username exist or not (operators)
  //hashed the password
  //store the data in db

  // console.log("lineAC2",req.body);
  const { name, email, username, password } = req.body;

  //Data Validation
  try {
    await userDataValidate({ name, email, username, password });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid Data",
      error: error,
    });
  }

  //Hashed the Password
  const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));
  //console.log("lineAC23",hashedPassword);

  const userObj = new User({ name, email, username, password: hashedPassword });
  try {
    const userDb = await userObj.registerUser();
    return res.send({
      status: 201,
      message: "Register successfully",
      data: userDb,
    });
  } catch (error) {
    //console.log("lineAC34",error);
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const loginController = async (req, res) => {
  // console.log("lineAC43", req.body);
  const { loginId, password } = req.body;

  //DATA VALIDATION
  if (!loginId || !password) {
    return res.send({
      status: 400,
      message: "Missing user credentials",
    });
  }
  try {
    //find the user
    const userDb = await User.findUserWithKey({ key: loginId });
    //console.log("lineAC64",userDb)

    // console.log("lineAC65", password, userDb.password)
    //compare the password
    const isMatched = await bcrypt.compare(password, userDb.password);
    //console.log("lineAC66",isMatched)
    if (!isMatched) {
      return res.send({
        status: 400,
        message: "Incorrect Password",
      });
    }

    req.session.isAuth = true;
    req.session.user = {
      userId: userDb._id,
      username: userDb.username,
      email: userDb.email,
    };

    return res.send({
      status: 200,
      message: "Login Successfull!",
    });
  } catch (error) {
    console.log("lineAC66", error);
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};
const logoutController = (req, res) => {
  // console.log("lineAC96",req.session);
  req.session.destroy((error) => {
    if (error) {
      return res.send({
        status: 400,
        message: "logout unsuccessfull",
      });
    }
    return res.send({
      status:200,
      message:"Logout successfull",
    });
  });
};

module.exports = { loginController, registerController, logoutController };
