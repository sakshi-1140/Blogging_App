const accessSchema = require("../schemas/accessSchema");

const rateLimiting = async (req, res, next) => {
  //console.log("lineRL2",req.session.id);
  const sessionId = req.session.id;

  try {
    //check if sid exist in access collection in DB
    const accessDb = await accessSchema.findOne({ sessionId });
   // console.log("lineRL11", accessDb);

    if (!accessDb) {
      //this is first Request
      const accessObj = new accessSchema({
        sessionId,
        lastReqTime: Date.now(),
      });
      await accessObj.save();
      next();
      return;
    }

    //R2-Rnth
    console.log("lineRl24", (Date.now() - accessDb.lastReqTime) / 1000); //ms->sec
    const diff = (Date.now() - accessDb.lastReqTime) / 1000; //in sec
    if (diff < 1) {
      return res.send({
        status: 429,
        message: "Too many request, please wait for some time.",
      });
    }

    await accessSchema.findOneAndUpdate(
      { sessionId },
      { lastReqTime: Date.now() }
    );
    next();
  } catch (error) {
    console.log("lineRL13", error);
    return res.send({
      status: 500,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = rateLimiting;
