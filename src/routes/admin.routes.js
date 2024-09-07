const express = require("express");
const { handleAdminLogin } = require("../controllers/admin.controllers");
const router = express.Router();

router.route('/login').post(handleAdminLogin);

module.exports = router;
