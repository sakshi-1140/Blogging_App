const {
  followUser,
  getFollowingList,
  unfollowUser,
  getFollowerList,
} = require("../models/followModel");
const User = require("../models/userModel");

const followUserController = async (req, res) => {
  // console.log("lineFC3", req.body);
  const followingUserId = req.body.followingUserId;
  const followerUserId = req.session.user.userId;

  // Find users corresponding to followerUserId and followingUserId
  try {
    await User.findUserWithKey({ key: followingUserId });
    await User.findUserWithKey({ key: followerUserId });
  } catch (error) {
    console.log("lineFC13", error);
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }

  //Create and save a new follow document in the database
  try {
    const followDb = await followUser({ followerUserId, followingUserId });
    return res.send({
      status: 201,
      message: "follow successfull",
      data: followDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};


const getFollowingListController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;

  // console.log("lineFC43",followerUserId,SKIP)

  try {
    const followingListDb = await getFollowingList({ followerUserId, SKIP });
    
    if(followingListDb.length===0){
      return res.send({
        status:204,
        message:"No following found",
      });
    }
    
    return res.send({
      status: 200,
      message: "Read success",
      data: followingListDb,
    });
  } catch (error) {
    console.log("lineFC53", error);
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const getFollowerListController = async (req, res) => {
  const followingUserId = req.session.user.userId;
  const SKIP = Number(req.query.skip) || 0;

  // console.log("lineFC79",followingUserId,SKIP)

  try {
    const followerListDb = await getFollowerList({ followingUserId, SKIP });
    
    if(followerListDb.length===0){
      return res.send({
        status:204,
        message:"No follower's found",
      });
    }
    
    return res.send({
      status: 200,
      message: "Read success",
      data: followerListDb,
    });
  } catch (error) {
    console.log("lineFC98", error);
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

const unfollowController = async (req, res) => {
  const followerUserId = req.session.user.userId;
  const followingUserId = req.body.followingUserId;
  //console.log("lineFC65", followerUserId,followingUserId);

  try {
    //Unfollow the user
    const followDb = await unfollowUser({ followerUserId, followingUserId });
    return res.send({
      status: 200,
      message: "Unfollow successfull",
      data: followDb,
    });
  } catch (error) {
    console.log("lineFC76", error);
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};


module.exports = {
  followUserController,
  getFollowingListController,
  unfollowController,
  getFollowerListController,
};
