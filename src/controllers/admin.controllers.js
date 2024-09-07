const { asyncHandler } = require("../common/asyncHandler");
const { adminLogin } = require("../services/admin.services");
const ApiResponse = require("../utils/ApiResponse");

exports.handleAdminLogin = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  const { admin, token, message } = await adminLogin(userName, password);

  if (!admin) {
    return res.status(200).json(
      new ApiResponse(200, {
        message,
      })
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { token, user: admin }, message));
});
