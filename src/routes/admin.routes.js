const express = require("express");
const {
  handleAdminLogin,
  handleAddCustomer,
  handleAddEngineer,
  handleGetAllComplaints,
  handleGetAllEngineer,
  handleGetSingleComplaint
} = require("../controllers/admin.controllers");
const { admin } = require("../middleware/protectedRoutes");
const router = express.Router();

router.route("/login").post(handleAdminLogin);
router.route("/addCustomer").post(admin, handleAddCustomer);
router.route("/addEngineer").post(admin, handleAddEngineer);
router.route("/get-complaints").get(admin, handleGetAllComplaints);
router.route("/get-engineers").get(admin, handleGetAllEngineer);
router.route("/get-complaints/:id").get(admin, handleGetSingleComplaint);

module.exports = router;
