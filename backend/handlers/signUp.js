const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");
const nodemailer = require("nodemailer");
const axios = require("axios");

// Transporter created here to be reused.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const signUp = async (req, res) => {
  const UserModel = mongoose.model("User");
  const { role } = req.params;
  const { name, email, description, phone, password, companyName } = req.body;
  const image = req.files?.image?.[0]
    ? path.basename(req.files.image[0].path)
    : null;

  // Access the uploaded CV
  const resume = req.files?.resume?.[0]
    ? path.basename(req.files.resume[0].path)
    : null;
  const encPass = await bcrypt.hash(password, 10);
  try {
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User with that email already exists." });
    }
    let userData;
    // Handle candidate signup with resume processing logic.
    if (role === "developer" && resume) {
      try {
        const fileURL = `http://localhost:8000/resumes/${resume}`;
        const encodedURL = encodeURIComponent(fileURL);
        const response = await axios.get(
          `http://127.0.0.1:8001/process-resume?file_url=${encodedURL}`
        );
        console.log(response.data);
        const tag = req.body.role;
        const skills = req.body.skills;
        const rate = req.body.rate;
        userData = await UserModel.create({
          name,
          description,
          email,
          phone,
          password: encPass,
          image,
          role,
          resume,
          tag,
          rate,
          skills,
        });
      } catch (e) {
        console.log("Error parsing resume ", e);
        return res.status(500).json({
          status: "failed",
          msg: "Failed to process resume.",
        });
      }
    } else {
      // Handle other signup scenarios
      let org;
      if (role === "client" && companyName) {
        org = companyName;
      }
      userData = await UserModel.create({
        name,
        description,
        email,
        phone,
        password: encPass,
        image,
        role,
        org,
      });
    }
    // Send Welcome Email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Platform!",
      html: `<h1>Welcome, ${name}!</h1>
               <p>Thank you for registering on our platform. We are thrilled to have you here!</p>
               <p>If you have any questions or need assistance, feel free to contact us.</p>
               <p>Best regards,<br>DevX</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
    res
      .status(200)
      .json({ status: "success", msg: "registered", data: userData });
  } catch (e) {
    console.error("Signup error:", e);
    if (e.name === "ValidationError") {
      return res
        .status(400)
        .json({ status: "failed", msg: "Validation error:" + e.message });
    }
    return res.status(500).json({ status: "failed", msg: "Signup failed." });
  }
};

module.exports = signUp;
