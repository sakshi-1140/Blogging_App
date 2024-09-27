const registerController = (req, res) => {
  console.log("register");
  return res.send("register api controlller");
};

const loginController = (req, res) => {
  console.log("login api");
  return res.send("login api controller");
};

module.exports = { loginController, registerController };
