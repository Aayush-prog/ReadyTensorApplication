const mongoose = require("mongoose");

const clientDashboard = async (req, res) => {
  console.log("in client dashboard");
  const UserModel = mongoose.model("User");
  const JobModel = mongoose.model("Job");
  const _id = req.user._id;
  const getUser = await UserModel.findOne({
    _id: _id,
  });
  const jobs = await JobModel.find({ client: getUser._id });
  res.status(200).send({ data: getUser, jobs });
};

module.exports = clientDashboard;
