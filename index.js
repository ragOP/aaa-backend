const express = require('express');
const handleConnectionToDB = require('./src/db/config');
const app = express();
require("dotenv").config();

const port = 8000 || process.env.PORT;

// Database Connection
handleConnectionToDB(process.env.MONGO_URI);

app.listen(port, () => {
  console.log(`Server Running on ${port}`)
})