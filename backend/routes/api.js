const pool = require("../config/db");

async function getAllTickets(req, res) {
  try {
    const result = await pool.query("SELECT * FROM tickets");
    res.json(result.rows);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).send("Internal server error");
  }
}
