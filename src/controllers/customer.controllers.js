const { asyncHandler } = require("../common/asyncHandler");
const {
  customerLogin,
  createComplaint,
  getMyComplaint,
} = require("../services/customer.services");
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

exports.handleNewComplaint = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const complaintData = req.body;
  const images = req.files;
  if (!customerId || !complaintData) {
    return res
      .status(400)
      .json(new ApiResponse(400, { messaage: "Invalid request" }));
  }
  const { complaint, messaage } = await createComplaint(
    customerId,
    complaintData,
    images
  );
  if (!complaint) {
    return res.status(500).json(
      new ApiResponse(500, {
        messaage,
      })
    );
  }
  console.log(complaint, messaage);
  return res
    .status(201)
    .json(new ApiResponse(201, { data: complaint }, messaage));
});

exports.handleGetMyComplaint = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  if (!customerId) {
    return res
     .status(400)
     .json(new ApiResponse(400, { messaage: "Please Provide Customer Id" }));
  }
  const { complaint, messaage } = await getMyComplaint(customerId);
  if (!complaint) {
    return res.status(500).json(
      new ApiResponse(500, {
        messaage,
      })
    );
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { data: complaint }, messaage));
})
