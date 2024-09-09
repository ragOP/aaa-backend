const express = require("express");
const { handleCustomerLogin } = require("../controllers/customer.controllers");
const router = express.Router();

router.route('/login').post(handleCustomerLogin);

module.exports = router;