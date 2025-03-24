const express = require("express");
const upload = require("../../middleware/upload.js");
const auth = require("../../middleware/auth");
const devDashboard = require("./controllers/devDashboard");
const getDev = require("./controllers/getDev");
const getDevById = require("./controllers/getDevById");
const applyJob = require("./controllers/applyJob.js");
const getReviewById = require("./controllers/getReviewById.js");
const developerRouter = express.Router();

developerRouter.get("/", getDev);
developerRouter.get("/getDevById/:id", getDevById);
developerRouter.use(auth);
developerRouter.get("/dashboard", devDashboard);
developerRouter.post("/applyJob/:jobId", upload, applyJob);
developerRouter.get("/review/:id", getReviewById);

module.exports = developerRouter;
