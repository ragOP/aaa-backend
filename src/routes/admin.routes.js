const express = require("express");
const multer = require("multer");
const { storage } = require("../config/multer");
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
  handleAddProject,
  handleGetAllProjects,
  handleGetSingleProject,
  handleSingleDeleteProject,
  handleGenerateWarranty,
} = require("../controllers/admin.controllers");
const { admin } = require("../middleware/protectedRoutes");
const router = express.Router();
const upload = multer({ storage: storage });

router.route("/login").post(handleAdminLogin);
router.route("/addCustomer").post(admin, handleAddCustomer);
router.route("/addEngineer").post(admin, handleAddEngineer);
router.route("/get-complaints").get(admin, handleGetAllComplaints);
router.route("/get-engineers").get(admin, handleGetAllEngineer);
router.route("/get-complaints/:id").get(admin, handleGetSingleComplaint);
router.route("/add-technican/:complaintId").patch(admin, handleAddTechnican);
router
  .route("/get-technican/:technicianId")
  .get(admin, handleGetTechnicanDetails);
router.route("/get-customer/:customerId").get(admin, handleGetCustomerDeatils);
router.route("/get-stats/").get(admin, handleGetDashboardStats);
router.route("/get-customers/").get(admin, handleGetAllCustomers);
router.route("/add-project/").post(
  admin,
  upload.fields([
    { name: "AMC", maxCount: 1 },
    { name: "warranty", maxCount: 1 },
    { name: "technical_documentation", maxCount: 1 },
  ]),
  handleAddProject
);
router.route("/get-project/").get(admin, handleGetAllProjects);
router.route("/get-single-project/:id").get(admin, handleGetSingleProject);
router.route("/delete-single-project/:id").delete(admin, handleSingleDeleteProject);
router.route("/generate-warranty").post(admin, upload.single('warrantyPdf'), handleGenerateWarranty);
module.exports = router;
