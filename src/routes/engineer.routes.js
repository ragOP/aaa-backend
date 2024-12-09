const express = require("express");
const { handleEngineerLogin, handleGetAllJobs, handleStartNewJob, handleGetSingleJobs } = require("../controllers/engineer.controllers");
const { engineer } = require("../middleware/protectedRoutes");
const router = express.Router();

router.route('/login').post(handleEngineerLogin);
router.route('/get-all-jobs').get(engineer, handleGetAllJobs);
router.route('/start-job/:id').post(engineer, handleStartNewJob);
router.route('/single-job/:id').get(engineer, handleGetSingleJobs);

module.exports = router;