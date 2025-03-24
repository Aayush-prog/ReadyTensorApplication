const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const hire = async (req, res) => {
  const { applicationId } = req.params;
  const JobModel = mongoose.model("Job");
  const UserModel = mongoose.model("User");
  const ApplicationModel = mongoose.model("Application");
  const application = await ApplicationModel.findById(applicationId);
  const job = await JobModel.findByIdAndUpdate(application.job, {
    status: "In Progress",
    applicants: [],
    developer: application.developer,
  });
  const dev = await UserModel.findByIdAndUpdate(application.developer, {
    $push: { ongoingJobs: application.job },
    $pull: {
      applied: application.job,
    },
  });
  const client = await UserModel.findByIdAndUpdate(job.client, {
    $push: { ongoingJobs: application.job },
    $pull: {
      openJobs: application.job,
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
    to: updateUser.email,
    subject: "Thank you applying!",
    html: `
                  <p>COngratulations for getting hired in  ${job.title}.</p>
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
module.exports = hire;
