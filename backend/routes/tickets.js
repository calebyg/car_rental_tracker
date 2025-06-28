// routes/tickets.js
// File contains ticket Routing Logic

const express = require("express");
const router = express.Router();
const pool = require("../config/db");

const {
  createTicket,
  getTicketById,
  getAllTickets,
  deleteTicketByID,
  deleteAllTickets,
} = require("../queries/tickets");

// POST new ticket
router.post("/", async (req, res) => {
  try {
    const newTicket = await createTicket(req.body);
    res.status(201).json(newTicket);
  } catch (err) {
    console.error("Error creating ticket: ", err);
    res.status(500).send("Internal server error");
  }
});

// GET ticket by ID
router.get("/:id", async (req, res) => {
  try {
    const ticket = await getTicketById(req.params.id);
    const result =
      ticket === null ? `Ticket id ${req.params.id} doesn't exist!` : ticket;
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Ticket by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { ticket_type, rental_id, vehicle_id, notes } = req.body;

  try {
    const result = await pool.query(
      `UPDATE tickets
      SET ticket_type = $1, rental_id = $2, vehicle_id = $3,
      notes = $4 WHERE id = $5 RETURNING *`,
      [ticket_type, rental_id, vehicle_id, notes, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update ticket!" });
  }
});

// Update Status of Ticket by ID
router.put("/status/:id", async (req, res) => {
  const { id } = req.params;
  const { currentStatus } = req.body;
  const newStatus = currentStatus === "Resolved" ? "Active" : "Resolved";

  try {
    const result = await pool.query(
      `UPDATE tickets SET status = $1 where id = $2 RETURNING *`,
      [newStatus, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Failed to update ticket status:", err);
    res.status(500).json({ error: "Could not update ticket status" });
  }
});

// GET all tickets
router.get("/", async (req, res) => {
  try {
    const tickets = await getAllTickets();
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE all tickets
/* Must be before router.delete("/id")
   to avoid API routing collision */
router.delete("/delete-all", async (req, res) => {
  let { idList } = req.body;

  try {
    idList = idList.map(Number);
    await deleteAllTickets(idList);
    res.status(200).json({ message: "Tickets deleted successfully" });
  } catch (err) {
    console.log("delete-all error: ", err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE a ticket
router.delete("/:id", async (req, res) => {
  try {
    const ticket = await getTicketById(req.params.id);
    if (ticket !== null) {
      await deleteTicketByID(req.params.id);
      res.status(204).end();
    } else res.json(`Ticket id ${req.params.id} doesn't exist!`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
