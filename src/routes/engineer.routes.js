const express = require("express");
const { handleEngineerLogin } = require("../controllers/engineer.controllers");
const router = express.Router();

router.route('/login').post(handleEngineerLogin);

module.exports = router;