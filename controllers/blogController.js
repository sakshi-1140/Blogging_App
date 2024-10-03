const {
  createBlog,
  getAllBlogs,
  getMyBlogs,
  getBlogWithId,
  editBlogWithId,
  deleteBlogWithId,
} = require("../models/blogModel");
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
    const myblogDb = await getMyBlogs({ SKIP, userId });

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

const editBlogController = async (req, res) => {
  //Data Validation
  //find the Blog with Id
  //ownership check
  //if time is less than 30min
  //update the blog

  console.log("lineBC106", req.body);
  // console.log("lineBC107", req.session);
  const { title, textBody, blogId } = req.body;
  const userId = req.session.user.userId;

  //Data Validation
  try {
    await blogDataValidation({ title, textBody });
  } catch (error) {
    return res.send({
      status: 400,
      message: "Data Invalid",
      error: error,
    });
  }

  try {
      //find the Blog with Id
    const blogDb = await getBlogWithId({ blogId });
    //console.log("lineBC124",blogDb);

    //OwnerShip Check

    //console.log("lineBC127",userId,blogDb.userId);
    //console.log("lineBC128",typeof userId)

    //id1.equals(id2)
    //id1.toString() === id2.toString()

    //console.log("lineBC133",userId.equals(blogDb.userId))
    if (!userId.equals(blogDb.userId)) {
      return res.send({
        status: 403,
        message: "Not allowed to edit this blog",
      });
    }

    // check if time is less than 30min

    // console.log("lineBC142",blogDb.creationDateTime,Date.now());
    //console.log("lineBC143", (Date.now()-blogDb.creationDateTime)/(1000*60*60*24)) //milisec->>sec->min->hour->day
    //console.log("lineBC143", (Date.now()-blogDb.creationDateTime)/(1000*60)) //in minutes
    const differenceInTime = (Date.now() - blogDb.creationDateTime) / (1000 * 60);
    if (differenceInTime > 30) {
      return res.send({
        status: 400,
        message: "Not allow to edit the blog after 30 mins of creation",
      });
    }

    //update the Blog
    const updatedBlogDb = await editBlogWithId({ title, textBody, blogId });

    return res.send({
      status: 200,
      message: "Blog updated successfully",
      data: updatedBlogDb,
    });
  } catch (error) {
    console.log("lineBC155", error);
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};


const deleteBlogController = async (req, res) => {
  console.log("lineBC182",req.body);
  const blogId = req.body.blogId;
  const userId = req.session.user.userId;

try{
  //find the Blog
  const blogDb = await getBlogWithId({blogId});

  //ownerShip check
  if(!userId.equals(blogDb.userId)){
    return res.send({
      status: 403,
      message: "Not allowed to delete this blog",
    });
  }

////delete the blog
const deletedBlogDb = await deleteBlogWithId({blogId})

return res.send({
  status: 200,
  message: "Delete successfull",
  data: deletedBlogDb,
});

}catch(error){
  return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    })
}
};



module.exports = {
  createBlogController,
  getBlogsController,
  getMyBlogsController,
  editBlogController,
  deleteBlogController,
};
