const { asyncHandler } = require("../common/asyncHandler");
const {
  engineerLogin,
  getAllJobs,
  startJob,
  getSingleJobs,
  completedJob,
} = require("../services/engineer.services");
const ApiResponse = require("../utils/ApiResponse");

exports.handleEngineerLogin = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  const { engineer, token, message } = await engineerLogin(userName, password);
  if (!engineer) {
    return res.status(200).json(
      new ApiResponse(200, {
        message,
      })
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { user: engineer, token }, message));
});
exports.handleGetAllJobs = asyncHandler(async (req, res) => {
  const engineer = req.user;
  const id = engineer._id;

  const { jobs, message, statusCode } = await getAllJobs(id);
  if (!jobs) {
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res.status(200).json(new ApiResponse(200, { user: jobs }, message));
});

exports.handleStartNewJob = asyncHandler(async (req, res) => {
  const { statusCode } = req.body;
  const { id } = req.params;
  const engineerId = req.user._id;

  const { job, message, statuscode } = await startJob(
    id,
    statusCode,
    engineerId
  );
  if (!job) {
    return res.status(200).json(
      new ApiResponse(statuscode, {
        message,
      })
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(statuscode, { user: job }, message));
});

exports.handleGetSingleJobs = asyncHandler(async (req, res) => {
  const engineerId = req.user._id;
  const { id } = req.params;

  const { job, message, statusCode } = await getSingleJobs(id, engineerId);
  if (!job) {
    return res.status(200).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res.status(200).json(new ApiResponse(200, { user: job }, message));
});

exports.handleCompletedJob = asyncHandler(async (req, res) => {
  const engineerId = req.user._id;
  const { id } = req.params;
  const { repairDescription, replacedParts, remarks, statusCode } = req.body;

  const completedVoiceNote = req?.files?.completedVoiceNote
    ? req.files.completedVoiceNote[0]
    : null;


  if(!repairDescription || !completedVoiceNote || !replacedParts || !remarks || !statusCode ){
    return res.status(200).json(
      new ApiResponse(400, {
        message: "All fields are required",
      })
    );
  }

  const { job, message, statuscode } = await completedJob(
    id,
    engineerId,
    repairDescription,
    replacedParts,
    remarks,
    completedVoiceNote,
    statusCode
  );

  if (!job) {
    return res.status(200).json(
      new ApiResponse(statuscode, {
        message,
      })
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(statuscode, { user: job }, message));
});
