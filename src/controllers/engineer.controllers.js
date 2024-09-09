const { asyncHandler } = require("../common/asyncHandler");
const { engineerLogin } = require("../services/engineer.services");
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
