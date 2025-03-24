const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const path = require("path");
const nodemailer = require("nodemailer");
const { PDFNet } = require("@pdftron/pdfnet-node");
const { TesseractWorker } = require("tesseract.js");
const { JSDOM } = require("jsdom"); // for image.src
const fs = require("fs"); // for temporary files
const {
  BertTokenizer,
  BertForSequenceClassification,
} = require("transformers");

// Transporter created here to be reused.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Use the TesseractWorker
const worker = new TesseractWorker();

// Load the pre-trained BERT model
async function loadModel() {
  const modelPath = path.join(__dirname, "D:/ResumeClassifier");
  const tokenizer = await BertTokenizer.from_pretrained(modelPath);
  const model = await BertForSequenceClassification.from_pretrained(modelPath);
  return { tokenizer, model };
}

// Initialize the model
let modelData = null;
loadModel().then((data) => {
  modelData = data;
});

// Job labels
const label = [
  "Data Scientist",
  "Database Engineer",
  "Designer",
  "DevOps Engineer",
  "DotNet Developer",
  "Information Technology",
  "Java Developer",
  "Network Security Engineer",
  "Python Developer",
  "QA",
  "React Developer",
  "SAP Developer",
  "SQL Developer",
];

// Developer skills (same as in Python)
const developerSkills = new Set([
  "python",
  "java",
  "c++",
  "javascript",
  "html",
  "css",
  "react",
  "angular",
  "node.js",
  "django",
  "flask",
  "spring",
  "kotlin",
  "swift",
  "typescript",
  "git",
  "docker",
  "kubernetes",
  "sql",
  "mongodb",
  "nosql",
  "aws",
  "azure",
  "graphql",
  "tailwindcss",
  "sass",
  "less",
  "next.js",
  "nuxt.js",
  "redux",
  "bootstrap",
  "jquery",
  "php",
  "laravel",
  "rust",
  "go",
  "bash",
  "ruby",
  "perl",
  "tensorflow",
  "pytorch",
  "scikit-learn",
  "hadoop",
  "spark",
  "tableau",
  "powerbi",
  "matplotlib",
  "seaborn",
  "pandas",
  "numpy",
  "opencv",
  "unity",
  "blender",
  "firebase",
  "heroku",
  "gcp",
  "vagrant",
  "ansible",
  "terraform",
  "elasticsearch",
  "rabbitmq",
  "solr",
  "c#",
  "r",
  "julia",
  "haskell",
  "flutter",
  "dart",
  "three.js",
  "chart.js",
]);

// Function to extract text from image using tesseract.js
async function extractTextFromImage(imagePath) {
  try {
    const { data } = await worker.recognize(imagePath);
    return data.text;
  } catch (error) {
    console.error("Error during OCR: ", error);
    return "";
  }
}

// Function to extract text from PDF using pdfTron
async function extractTextFromPdf(pdfPath) {
  try {
    await PDFNet.initialize();
    const doc = await PDFNet.PDFDoc.createFromFilePath(pdfPath);
    const txtExtract = await PDFNet.TextExtractor.create();
    let extracted_text = "";
    for (let i = 1; i <= (await doc.getPageCount()); i++) {
      const page = await doc.getPage(i);
      txtExtract.begin(page);
      extracted_text += await txtExtract.getText();
    }
    return extracted_text;
  } catch (error) {
    console.error("Error during PDF to text:", error);
    return "";
  }
}

// Function to clean extracted text (same as Python version)
function cleanText(text) {
  text = text.replace(/[^a-zA-Z\s]/g, "");
  text = text.toLowerCase();
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

// Function to extract skills from text (same as Python version)
function extractSkills(text) {
  const words = new Set(text.split(" "));
  const extractedSkills = [...words].filter((word) =>
    developerSkills.has(word)
  );
  return extractedSkills;
}

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
        let extractedText = "";
        //read file from path
        const resumePath = path.join(__dirname, "resumes", resume);
        const fileBuffer = fs.readFileSync(resumePath);
        const contentType = req.files?.resume[0].mimetype;
        if (contentType.includes("pdf")) {
          // Create a temporary file and use it to extract text from PDF
          const tempPdfPath = path.join(__dirname, `temp_${Date.now()}.pdf`);
          fs.writeFileSync(tempPdfPath, fileBuffer);
          extractedText = await extractTextFromPdf(tempPdfPath);
          // Remove the temp file
          fs.unlinkSync(tempPdfPath);
        } else if (contentType.includes("image")) {
          // Create a temporary file and use it to extract text from Image
          const tempImagePath = path.join(
            __dirname,
            `temp_${Date.now()}.${contentType.split("/")[1]}`
          );
          fs.writeFileSync(tempImagePath, fileBuffer);
          extractedText = await extractTextFromImage(tempImagePath);
          fs.unlinkSync(tempImagePath);
        } else {
          return res
            .status(400)
            .json({
              error: "Unsupported file type. Please upload a PDF or an image.",
            });
        }
        const cleanedText = cleanText(extractedText);
        const skills = extractSkills(cleanedText);

        // Model inference
        if (!modelData) {
          return res.status(500).json({ error: "Model not loaded yet" });
        }
        const inputs = await modelData.tokenizer(cleanedText, {
          return_tensors: "pt",
          truncation: true,
          padding: true,
          max_length: 128,
        });
        const outputs = await modelData.model(inputs);
        const predictedLabel = outputs.logits.argMax(1).item();
        const tag = label[predictedLabel];
        const rate = req.body.rate;
        if (!skills || !tag) {
          return res.status(500).json({
            status: "failed",
            msg: "Failed to process resume, no role or skill provided from resume processor",
          });
        }

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
        console.error("Error processing resume:", e);
        return res.status(500).json({
          status: "failed",
          msg: `Failed to process resume: ${e.message}`,
        });
      }
    } else {
      // Handle other signup scenarios (client, etc.)
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
