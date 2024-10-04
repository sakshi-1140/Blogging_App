const {
  followUser,
  getFollowingList,
  unfollowUser,
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
};
