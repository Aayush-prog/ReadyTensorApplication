const mongoose = require("mongoose");
const editJob = async (req, res) => {
  const UserModel = mongoose.model("User");
  const JobModel = mongoose.model("Job");
  const { jobId } = req.params;
  const {
    title,
    catchphrase,
    additionalInfo,
    description,
    budget,
    requiredTags,
    status,
  } = req.body;
  try {
    console.log(title);
    const job = await JobModel.findById(jobId);
    if (!job) {
      return res.status(404).json({
        status: "error",
        message: "Job not found",
      });
    }
    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "You are not authorized to update this job",
      });
    }

    const updatedJob = await JobModel.findByIdAndUpdate(jobId, {
      title,
      catchphrase,
      additionalInfo,
      description,
      budget,
      requiredTags,
      status,
    });

    res.status(200).json({
      status: "success",
      message: "Job updates successfully",
      data: updatedJob,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message || error,
    });
  }
};
module.exports = editJob;
