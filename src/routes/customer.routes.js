const express = require("express");
const multer = require("multer");
const { storage } = require("../config/multer");
const { handleCustomerLogin, handleNewComplaint, handleGetMyComplaint } = require("../controllers/customer.controllers");
const { customer } = require("../middleware/protectedRoutes");
const router = express.Router();
const upload = multer({ storage: storage });

router.route('/login').post(handleCustomerLogin);
router.route('/new-complaint/:customerId').post(customer, upload.array("images", 5), handleNewComplaint);
router.route('/my-complaint/:customerId').get(customer, handleGetMyComplaint);

module.exports = router;