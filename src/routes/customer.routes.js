const express = require("express");
const multer = require("multer");
const { storage } = require("../config/multer");
const {
  handleCustomerLogin,
  handleNewComplaint,
  handleGetMyComplaint,
  handleRaisePriority,
  handleGetMyDetails,
  handleSingleComplaint,
} = require("../controllers/customer.controllers");
const { customer } = require("../middleware/protectedRoutes");
const router = express.Router();
const upload = multer({ storage: storage });

router.route("/login").post(handleCustomerLogin);
router.route("/new-complaint/:customerId").post(
  customer,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "voiceNote", maxCount: 1 },
  ]),
  handleNewComplaint
);
router.route("/my-complaint/:customerId").get(customer, handleGetMyComplaint);
router.route("/raise-priorty/:complaintId").patch(customer, handleRaisePriority);
router.route("/get-user/").get(customer, handleGetMyDetails);
router.route("/get-single-complaint/:complaintId").get(customer, handleSingleComplaint);

module.exports = router;
