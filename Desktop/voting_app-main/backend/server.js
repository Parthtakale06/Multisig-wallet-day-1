const express = require("express");
const app = express();
const cors = require("cors"); // Import CORS middleware
const db = require("./db");
require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

// Use CORS middleware with options to allow requests from your frontend
const corsOptions = {
  origin: "http://127.0.0.1:5501", // Your frontend origin
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Import the router files
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

// Use the routers
app.use("/user", userRoutes);
app.use("/candidates", candidateRoutes);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
