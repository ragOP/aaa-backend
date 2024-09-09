const { asyncHandler } = require("../common/asyncHandler");
const { customerLogin } = require("../services/customer.services");
const ApiResponse = require("../utils/ApiResponse");

exports.handleCustomerLogin = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  const { customer, token, message } = await customerLogin(userName, password);
  if (!customer) {
    return res.status(200).json(
      new ApiResponse(200, {
        message,
      })
    );
  }
  
  return res
    .status(200)
    .json(new ApiResponse(200, { user: customer, token }, message));
});
