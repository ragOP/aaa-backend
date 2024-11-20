const jwt = require("jsonwebtoken");
const Admin = require("../models/admin.models");

const admin = async (req, res, next) => {
 try {
   let token = "";
   if (
     req.headers.authorization &&
     req.headers.authorization.startsWith("Bearer")
   ) {
     token = req.headers.authorization.split(" ")[1];
   }

   if (!token) {
     return res
       .status(400)
       .json({ message: "You are not logged in. Please login to get access" });
   }

   const data = jwt.verify(token, process.env.JWT_SECRET);
   if (!data) {
     return res
       .status(400)
       .json({ message: "You are not logged in. Please login to get access" });
   }
   if (data.role !== "admin") {
     return res.status(400).json({ message: "Only admin will have access." });
   }
   const admin = await Admin.find({ _id: data.id });
   if (!admin) {
     return res
       .status(400)
       .json({ message: "You are not logged in. Please login to get access" });
   }

   req.user = admin;
   next();
 } catch (error) {
   res.status(400).json({ message: error });
 }
};

module.exports = {
 admin,
};