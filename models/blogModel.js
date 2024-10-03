const { LIMIT } = require("../privateConstants");
const blogSchema = require("../schemas/blogSchema");

const createBlog = ({ title, textBody, userId }) => {
  return new Promise(async (resolve, reject) => {
    //create blogObj from blogSchema
    const blogObj = new blogSchema({
      title,
      textBody,
      userId,
      creationDateTime: Date.now(),
    });

    //save blog in DB
    try {
      const blogDb = await blogObj.save();
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getAllBlogs = ({ SKIP }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //sort skip limit
      const blogDb = await blogSchema.aggregate([
        { $sort: { creationDateTime: -1 } }, //DESC order
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const getMyBlogs = ({ SKIP, userId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      //match sort ,skip,limit
      const myBlogDb = await blogSchema.aggregate([
        { $match: { userId: userId } },
        { $sort: { creationDateTime: -1 } },
        { $skip: SKIP },
        { $limit: LIMIT },
      ]);
      resolve(myBlogDb);
    } catch (error) {
      console.log("lineBC52", error);
      reject(error);
    }
  });
};

const getBlogWithId = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    if (!blogId) return reject("Missing BlogId");
    try {
      const blogDb = await blogSchema.findOne({ _id: blogId });

      if (!blogDb) return reject(`Blog not found with BlogId : ${blogId}`);

      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const editBlogWithId = ({ blogId, title, textBody }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogDb = await blogSchema.findOneAndUpdate(
        { _id: blogId },
        { title, textBody },
        { new: true }
      );
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteBlogWithId = ({ blogId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blogDb = await blogSchema.findOneAndDelete({ _id: blogId });
      resolve(blogDb);
    } catch (error) {
      reject(error);
    }
  });
};



module.exports = {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getBlogWithId,
  editBlogWithId,
  deleteBlogWithId,
};
