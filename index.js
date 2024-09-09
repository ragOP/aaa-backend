const express = require('express');
const app = express();
const cors = require("cors");
require("dotenv").config();

const port = 8000 || process.env.PORT;

const handleConnectionToDB = require('./src/db/config');
const adminRoute = require("./src/routes/admin.routes");
const customerRoute = require("./src/routes/customer.routes");

app.use(cors());
app.use(express.json());

// Database Connection
handleConnectionToDB(process.env.MONGO_URI);

app.use('/api/admin', adminRoute);
app.use('/api/customer', customerRoute)

app.listen(port, () => {
  console.log(`Server Running on ${port}`)
})