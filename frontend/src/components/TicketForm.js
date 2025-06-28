import React, { useEffect, useState } from "react";
import "../stylesheets/TicketForm.css";

const TicketForm = ({ ticket, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    rentalId: "",
    vehicleId: "",
    createdBy: "",
    resolvedAt: null,
    resolvedBy: "",
    ticketType: "",
    notes: "",
  });

  useEffect(() => {
    if (ticket) {
      // Edit mode: pre-fill the form with ticket data
      setFormData({
        ticketType: ticket.ticket_type || "",
        rentalId: ticket.rental_id || "",
        vehicleId: ticket.vehicle_id || "",
        notes: ticket.notes || "",
      });
    } else {
      // Create mode: clear the form
      setFormData({
        rentalId: "",
        vehicleId: "",
        createdBy: "",
        resolvedAt: null,
        resolvedBy: "",
        ticketType: "",
        notes: "",
      });
    }
  }, [ticket]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ticket_type: formData.ticketType,
      rental_id: formData.rentalId,
      vehicle_id: formData.vehicleId,
      notes: formData.notes,
    };

    try {
      const method = ticket?.id ? "PUT" : "POST";
      const url = ticket?.id
        ? `http://localhost:5000/api/tickets/${ticket.id}`
        : `http://localhost:5000/api/tickets`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const savedTicket = await res.json();

      if (res.ok) {
        console.log("Success:", savedTicket);
        // Optional: clear form or trigger ticket refresh
      } else {
        console.error("Error", savedTicket);
      }

      console.log("Parsed response: ", savedTicket);

      // Update parent state and close modal/form
      onSave(savedTicket);
      onClose();
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  return (
    <div className="form-container">
      <h3 className="form-title">Add New Ticket</h3>
      <form onSubmit={handleSubmit}>
        <label>Ticket Type:</label>
        <select
          name="ticketType"
          value={formData.ticketType}
          onChange={handleChange}
          required
        >
          <option value="">Select type</option>
          <option value="Price adjustment">Price adjustment</option>
          <option value="EV charge">EV charge</option>
          <option value="Miles">Miles</option>
          <option value="Check-in">Check-in</option>
        </select>

        <label>Rental ID:</label>
        <input
          type="text"
          name="rentalId"
          value={formData.rentalId}
          onChange={handleChange}
          required
        />

        <label>Vehicle ID:</label>
        <input
          type="text"
          name="vehicleId"
          value={formData.vehicleId}
          onChange={handleChange}
        />

        <label>Notes:</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          required
        ></textarea>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Ticket
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default TicketForm;
