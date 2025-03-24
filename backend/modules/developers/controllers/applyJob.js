const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const applyJob = async (req, res) => {
  console.log("here in apply");
  const JobModel = mongoose.model("Job");
  const ApplicationModel = mongoose.model("Application");
  const UserModel = mongoose.model("User");
  const user = req.user;
  const { jobId } = req.params;
  const { coverLetter, timeframe, budget } = req.body;
  try {
    const newApplication = await ApplicationModel.create({
      coverLetter,
      timeframe,
      budget,
      developer: req.user._id,
      job: jobId,
    });

    const updated = await JobModel.findByIdAndUpdate(jobId, {
      $push: { applicants: req.user._id },
    });
    const updateUser = await UserModel.findByIdAndUpdate(user._id, {
      $push: { applied: jobId },
    });
    const job = await JobModel.findById(jobId);
    const client = await UserModel.findById(job.client);
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: updateUser.email,
      subject: "Thank you applying!",
      html: `
                <p>Thank you for applying in ${job.title}.</p>
                <p>Wait until you get hired!!!</p>
                <p>If you have any questions or need assistance, feel free to contact us.</p>
                <p>Best regards,<br>DevX</p>
              `,
    };
    const mailOptionsClient = {
      from: process.env.EMAIL_USER,
      to: client.email,
      subject: "Thank you applying!",
      html: `
                <p>You have a new application in ${job.title}</p>
                <p>If you have any questions or need assistance, feel free to contact us.</p>
                <p>Best regards,<br>DevX</p>
              `,
    };
    transporter.sendMail(mailOptions);
    transporter.sendMail(mailOptionsClient);
    res.status(200).json({
      status: "success",
      message: "Job applied successfully!",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message || error,
    });
  }
};
module.exports = applyJob;
