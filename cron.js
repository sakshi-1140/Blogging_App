const cron = require("node-cron");
const blogSchema = require("./schemas/blogSchema");

const cleanUpBin = () => {
  cron.schedule("* 0 * * *", async () => {
    try {
      //find all the deleted blogs from db
      const deletedBlogsDb = await blogSchema.find({ isDeleted: true });
      //console.log("lineCr9", deletedBlogsDb);
      if (deletedBlogsDb.length === 0) return;

      let deletedBlogsId = [];
      //find the blogs deleted 30 day ago.
      deletedBlogsDb.map((blog) => {
       // console.log((Date.now() - blog.deletionDateTime) / (1000 * 60 * 60 * 24));
        const diff = (Date.now() - blog.deletionDateTime) / (1000 * 60 * 60 * 24); // ms->sec->min->hr->day
        if (diff > 30) {
          deletedBlogsId.push(blog._id);
        }
      });
     // console.log("lineCr20", deletedBlogsId);

      if (deletedBlogsId.length === 0) return;

      //Delete Permanently from DB
      const deletedBlog = await blogSchema.findOneAndDelete({
        _id: { $in: deletedBlogsId },
      });

      console.log(`Blog deleted successfully BlogId: ${deletedBlog._id}`);
    } catch (error) {
      console.log("lineCr", error);
    }
  });
};

module.exports = cleanUpBin;
