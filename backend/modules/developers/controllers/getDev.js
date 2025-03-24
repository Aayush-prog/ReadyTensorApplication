const mongoose = require("mongoose");
const getDev = async (req, res) => {
  const UserModel = mongoose.model("User");
  const developers = await UserModel.find({ role: "developer" });
  res.status(200).send({ data: developers });
};
module.exports = getDev;
