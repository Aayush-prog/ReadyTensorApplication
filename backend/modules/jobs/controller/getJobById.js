const mongoose = require("mongoose");

const getJobById = async (req, res) => {
  const id = req.params.id;
  const JobModel = mongoose.model("Job");
  const UserModel = mongoose.model("User");
  const ApplicationModel = mongoose.model("Application");

  try {
    const job = await JobModel.findById(id);

    if (!job) {
      return res.status(404).send({ message: "Job not found" });
    }

    const applications = await ApplicationModel.find({ job: id });

    res.status(200).send({ data: job, applications });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};

module.exports = getJobById;
