const mongoose = require("mongoose");

const devDashboard = async (req, res) => {
  const UserModel = mongoose.model("User");
  const JobModel = mongoose.model("Job");
  const _id = req.user._id;
  const getUser = await UserModel.findOne({
    _id: _id,
  });
  const jobs = await JobModel.find({ developer: getUser._id });
  const applied = await JobModel.find({ applicants: getUser._id });
  res.status(200).send({ data: getUser, jobs, applied });
};

module.exports = devDashboard;
