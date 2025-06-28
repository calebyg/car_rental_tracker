const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

const app = express();
const PORT = process.env.DB_PORT || 5000;

// Environment variables
require("dotenv").config();

// Middleware
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});
app.use(cors());
app.use(express.json());

const ticketRoutes = require("./routes/tickets");

// Route mounting
app.use("/api/tickets", ticketRoutes);

app.get("/", (req, res) => res.send("Server is running"));

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
