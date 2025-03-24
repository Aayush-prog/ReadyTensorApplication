const mongoose = require("mongoose");
const createJob = async (req, res) => {
  console.log("in create Job");
  const UserModel = mongoose.model("User");
  const JobModel = mongoose.model("Job");
  const {
    title,
    catchphrase,
    additionalInfo,
    description,
    budget,
    requiredTags,
  } = req.body;
  try {
    const client = req.user._id;
    const newJob = await JobModel.create({
      title,
      catchphrase,
      additionalInfo,
      description,
      budget,
      requiredTags,
      client,
    });
    console.log(newJob);
    await UserModel.updateOne(
      { _id: req.user._id },
      {
        $push: { openJobs: newJob._id },
      }
    );
    res.status(201).json({
      status: "success",
      message: "Job created successfully",
      data: newJob,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message || error,
    });
  }
};
module.exports = createJob;
