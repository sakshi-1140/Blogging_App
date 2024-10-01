const { createBlog, getAllBlogs, getMyBlogs } = require("../models/blogModel");
const { blogDataValidation } = require("../utils/blogUtils");

const createBlogController = async (req, res) => {
  //console.log("lineBC4", req.body);
  //console.log("lineBC4", req.session);

  const { title, textBody } = req.body;
  const userId = req.session.user.userId;

  // console.log("lineBC8",typeof title);

  //Blog Data Validation
  try {
    await blogDataValidation({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Invalid Data",
      error: error,
    });
  }

  //Create Blog & save in DB
  try {
    const blogDb = await createBlog({ title, textBody, userId });
    return res.send({
      status: 201,
      message: "Blog created successfully!",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const getBlogsController = async (req, res) => {
  // console.log("lineBC42", req.query);
  const SKIP = Number(req.query.skip) || 0;

  try {
    const blogDb = await getAllBlogs({ SKIP });

    if (blogDb.length === 0) {
      return res.send({
        status: 204,
        message: "No blogs found",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
      data: blogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

const getMyBlogsController = async (req, res) => {
  const SKIP = Number(req.query.skip) || 0;
  const userId = req.session.user.userId;
  
  //console.log("lineBC73",userId)

  try {
    const myblogDb = await getMyBlogs({ SKIP,userId });

    if (myblogDb.length === 0) {
      return res.send({
        status: 204,
        message: "No blogs found",
      });
    }

    return res.send({
      status: 200,
      message: "Read success",
      data: myblogDb,
    });
  } catch (error) {
    return res.send({
      status: 500,
      message: "Internal Server Error",
      error: error,
    });
  }
};

module.exports = {
  createBlogController,
  getBlogsController,
  getMyBlogsController,
};
