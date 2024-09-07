const express = require("express");
const {
  handleAdminLogin,
  handleAddCustomer,
  handleAddEngineer,
} = require("../controllers/admin.controllers");
const { admin } = require("../middleware/protectedRoutes");
const router = express.Router();

router.route("/login").post(handleAdminLogin);
router.route("/addCustomer").post(admin, handleAddCustomer);
router.route("/addEngineer").post(admin, handleAddEngineer);

module.exports = router;
