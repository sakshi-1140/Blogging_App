const userSchema = require("../schemas/userSchema");

const User = class {
  constructor({ name, email, username, password }) {
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
  }

  registerUser() {
    return new Promise(async (resolve, reject) => {
      try {
        //Check if User already exist in DB
        const userExist = await userSchema.findOne({
          $or: [{ email: this.email }, { username: this.username }],
        });
        // console.log("lineUM19", userExist);

        if (userExist && userExist.email === this.email)
          return reject("Email already exist");
        if (userExist && userExist.username === this.username)
          return reject("Username already exist");

        // Save user Data in DataBase
        const userObj = new userSchema({
          name: this.name,
          email: this.email,
          username: this.username,
          password: this.password,
        });
        const userDb = await userObj.save();

        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
  static findUserWithKey({ key }) {
    return new Promise(async(resolve, reject) => {
      //console.log("lineUM43",key);
      try {
        //find user in Database
        const userDb = await userSchema.findOne({
            $or: [{email:key},{username:key}]
        })
        .select("+password");
        //console.log("lineUM48",userDb);
        if(!userDb) return reject("User Not found");
        resolve(userDb);
      } catch (error) {
        reject(error);
      }
    });
  }
  
};

module.exports = User;
