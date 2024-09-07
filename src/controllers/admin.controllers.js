const { asyncHandler } = require("../common/asyncHandler");
const { adminLogin, adminAddCustomer, adminAddEngineer } = require("../services/admin.services");
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

exports.handleAddCustomer = asyncHandler(async (req, res) => {
 const { userName, password, email, name} = req.body;
 const {customer, message} = await adminAddCustomer(userName, password, email, name);

 if(!customer){
  return res.status(200).json(
   new ApiResponse(200, {
     message,
   })
 );
 }

 return res
    .status(201)
    .json(new ApiResponse(201, { user: customer }, message));
})

exports.handleAddEngineer = asyncHandler(async (req, res) => {
 const { userName, password, email, name} = req.body;
 const {engineer, message} = await adminAddEngineer(userName, password, email, name);

 if(!engineer){
  return res.status(200).json(
   new ApiResponse(200, {
     message,
   })
 );
 }

 return res
    .status(201)
    .json(new ApiResponse(201, { user: engineer }, message));
})
