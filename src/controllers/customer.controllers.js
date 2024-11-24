const { asyncHandler } = require("../common/asyncHandler");
const {
  customerLogin,
  createComplaint,
  getMyComplaint,
  raisePriority,
} = require("../services/customer.services");
const ApiResponse = require("../utils/ApiResponse");

exports.handleCustomerLogin = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;

  const { customer, token, message, statusCode } = await customerLogin(
    userName,
    password
  );
  if (!customer) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        message,
      })
    );
  }

  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, { user: customer, token }, message));
});

exports.handleNewComplaint = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  const complaintData = req.body;
  const images = req.files.images;
  const voiceNote = req?.files?.voiceNote ? req.files.voiceNote[0] : null;
  console.log(voiceNote, "voice note");
  if (!customerId || !complaintData) {
    return res
      .status(400)
      .json(new ApiResponse(400, { messaage: "Invalid request" }));
  }
  const { complaint, messaage, statusCode } = await createComplaint(
    customerId,
    complaintData,
    images,
    voiceNote
  );
  if (!complaint) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        messaage,
      })
    );
  }
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, { data: complaint }, messaage));
});

exports.handleGetMyComplaint = asyncHandler(async (req, res) => {
  const { customerId } = req.params;
  if (!customerId) {
    return res
      .status(400)
      .json(new ApiResponse(400, { messaage: "Please Provide Customer Id" }));
  }
  const { complaints, messaage, statusCode } = await getMyComplaint(customerId);
  if (!complaints) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        messaage,
      })
    );
  }
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, { data: complaints }, messaage));
});

exports.handleRaisePriority = asyncHandler(async (req, res) => {
  const { complaintId } = req.params;
  if (!complaintId) {
    return res
      .status(400)
      .json(new ApiResponse(400, { messaage: "Please Provide Complaint Id" }));
  }
  const { complaint, messaage, statusCode } = await raisePriority(complaintId);
  console.log(messaage);
  if (!complaint) {
    return res.status(statusCode).json(
      new ApiResponse(statusCode, {
        messaage,
      })
    );
  }
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, { data: complaint }, messaage));
});
