const express = require("express");
const multer = require("multer");
const { storage } = require("../config/multer");
const {
  handleEngineerLogin,
  handleGetAllJobs,
  handleStartNewJob,
  handleGetSingleJobs,
  handleCompletedJob,
  handleForgetPassword
} = require("../controllers/engineer.controllers");
const { engineer } = require("../middleware/protectedRoutes");
const router = express.Router();
const upload = multer({ storage: storage });

router.route("/login").post(handleEngineerLogin);
router.route("/get-all-jobs").get(engineer, handleGetAllJobs);
router.route("/start-job/:id").post(engineer, handleStartNewJob);
router.route("/single-job/:id").get(engineer, handleGetSingleJobs);
router
  .route("/completed-job/:id")
  .post(
    engineer,
    upload.fields([{ name: "completedVoiceNote", maxCount: 1 }]),
    handleCompletedJob
  );
router.route("/forget-password").post(handleForgetPassword);  

module.exports = router;