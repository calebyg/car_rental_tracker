// queries/tickets.js
// File contains DB logic

const pool = require("../config/db");

// Create ticket
const createTicket = async (ticket) => {
  const {
    rental_id,
    vehicle_id,
    created_by,
    resolved_at,
    resolved_by,
    ticket_type,
    notes,
  } = ticket;

  const result = await pool.query(
    `INSERT INTO tickets (
    rental_id, vehicle_id, created_by,
    resolved_at, resolved_by, ticket_type, notes) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [
      rental_id,
      vehicle_id,
      created_by,
      resolved_at,
      resolved_by,
      ticket_type,
      notes,
    ]
  );

  return result.rows[0];
};

// Return ticket by ID from
const getTicketById = async (id) => {
  const result = await pool.query("SELECT * FROM tickets WHERE id = $1", [id]);
  return result.rows[0];
};

// Return all tickets from DB
const getAllTickets = async () => {
  const result = await pool.query(
    "SELECT * FROM tickets ORDER BY created_at DESC"
  );
  return result.rows;
};

// Delete ticket
const deleteTicketByID = async (id) => {
  await pool.query("DELETE FROM tickets WHERE id = $1", [id]);
};

// Delete all tickets
const deleteAllTickets = async (idList) => {
  const query = `DELETE FROM tickets WHERE id = ANY($1::int[])`;
  await pool.query(query, [idList]);
};

module.exports = {
  createTicket,
  getTicketById,
  getAllTickets,
  deleteTicketByID,
  deleteAllTickets,
};
