const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const completeJob = async (req, res) => {
  const { jobId } = req.params;
  const JobModel = mongoose.model("Job");
  const UserModel = mongoose.model("User");
  const job = await JobModel.findByIdAndUpdate(jobId, {
    status: "Completed",
  });
  const dev = await UserModel.findByIdAndUpdate(job.developer, {
    $push: { completedJobs: jobId },
    $pull: {
      ongoingJobs: jobId,
    },
  });
  const client = await UserModel.findByIdAndUpdate(job.client, {
    $push: { completedJobs: jobId },
    $pull: {
      ongoingJobs: jobId,
    },
  });
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: dev.email,
    subject: "Thank you performing your best!",
    html: `
                  <p>Congratulations for completing in  ${job.title}.</p>
                  <p>Have a great time ahead!!!</p>
                  <p>If you have any questions or need assistance, feel free to contact us.</p>
                  <p>Best regards,<br>DevX</p>
                `,
  };
  transporter.sendMail(mailOptions);
  res.status(200).send({
    status: "success",
  });
};
module.exports = completeJob;
