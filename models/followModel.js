const { LIMIT } = require("../privateConstants");
const followSchema = require("../schemas/followSchema");
const userSchema = require("../schemas/userSchema");

const followUser = ({ followingUserId, followerUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //check if already following
      const followAlreadyDb = await followSchema.findOne({
        followerUserId,
        followingUserId,
      });
      if (followAlreadyDb) {
        return reject("Already following the user.");
      }

      // Create a new follow document using the follow schema
      const followObj = new followSchema({
        followerUserId,
        followingUserId,
        creationDateTime: Date.now(),
      });
      // Save the follow document to the database
      const followDb = await followObj.save();
      resolve(followDb);
    } catch (error) {
      console.log("lineFC20", error);
      reject(error);
    }
  });
};

const getFollowingList = ({ followerUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //using .populate method
      //   const followingListDb = await followSchema
      //     .find({ followerUserId })
      //     .populate("followingUserId");

      //using aggregate method - match->sort->skip->limit
      const followingListDb = await followSchema.aggregate([
        { $match: { followerUserId } },
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);

      const followingUserIdsList = followingListDb.map(
        (follow) => follow.followingUserId
      );

      const followingUserDetails = await userSchema.find({
        _id: { $in: followingUserIdsList },
      });

      //console.log("lineFM57", followingListDb);
      // console.log("lineFM58", followingUserIdsList);
      // console.log("lineFM59", followingUserDetails);

      resolve(followingUserDetails.reverse());
    } catch (error) {
      console.log("lineFM41", error);
      reject(error);
    }
  });
};

const getFollowerList = ({ followingUserId, SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followerListDb = await followSchema.aggregate([
        { $match: { followingUserId } },
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);

      const followerUserIdsList = followerListDb.map(
        (follow) => follow.followerUserId
      );

      const followerUserDetails = await userSchema.find({
        _id: { $in: followerUserIdsList },
      });

    //  console.log("lineFM87", followerListDb);
    //  console.log("lineFM88", followerUserIdsList);
    //  console.log("lineFM89", followerUserDetails);

      resolve(followerUserDetails.reverse());
    } catch (error) {
      console.log("lineFM93", error);
      reject(error);
    }
  });
};

const unfollowUser = ({ followerUserId, followingUserId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const followDb = await followSchema.findOneAndDelete({
        followerUserId,
        followingUserId,
      });
      resolve(followDb);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  followUser,
  getFollowingList,
  unfollowUser,
  getFollowerList,
};
