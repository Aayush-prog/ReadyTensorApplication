const express = require("express");
const getQuestion = require("./controller/getQuestion");
const checkAns = require("./controller/checkAns");
const questionRouter = express.Router();

questionRouter.get("/", getQuestion);
questionRouter.post("/check", checkAns);
module.exports = questionRouter;
