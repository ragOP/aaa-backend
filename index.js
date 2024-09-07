const express = require('express');
const handleConnectionToDB = require('./src/db/config');
const app = express();
require("dotenv").config();

const port = 8000 || process.env.PORT;
const adminRoute = require("./src/routes/admin.routes");

// Database Connection
handleConnectionToDB(process.env.MONGO_URI);

app.use('/api/admin', adminRoute);

app.listen(port, () => {
  console.log(`Server Running on ${port}`)
})