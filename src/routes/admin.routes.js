const express = require("express");
const {
  handleAdminLogin,
  handleAddCustomer,
  handleAddEngineer,
  handleGetAllComplaints,
  handleGetAllEngineer,
  handleGetSingleComplaint,
  handleAddTechnican,
  handleGetTechnicanDetails,
  handleGetCustomerDeatils,
  handleGetDashboardStats,
  handleGetAllCustomers,
  handleAddProject
} = require("../controllers/admin.controllers");
const { admin } = require("../middleware/protectedRoutes");
const router = express.Router();

router.route("/login").post(handleAdminLogin);
router.route("/addCustomer").post(admin, handleAddCustomer);
router.route("/addEngineer").post(admin, handleAddEngineer);
router.route("/get-complaints").get(admin, handleGetAllComplaints);
router.route("/get-engineers").get(admin, handleGetAllEngineer);
router.route("/get-complaints/:id").get(admin, handleGetSingleComplaint);
router.route("/add-technican/:complaintId").patch(admin, handleAddTechnican);
router.route("/get-technican/:technicianId").get(admin, handleGetTechnicanDetails);
router.route("/get-customer/:customerId").get(admin, handleGetCustomerDeatils);
router.route("/get-stats/").get(admin, handleGetDashboardStats);
router.route("/get-customers/").get(admin, handleGetAllCustomers);
router.route("/add-project/").post(admin, handleAddProject);

module.exports = router;
