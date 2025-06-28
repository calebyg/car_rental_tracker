import React, { useEffect, useState, useMemo } from "react";
import TicketForm from "./TicketForm";
import "../stylesheets/TicketList.css";

const TicketList = () => {
  const [tickets, setTickets] = useState([]); // All tickets in DB
  const [displayTickets, setDisplayTickets] = useState([]); // Tickets filtered by status or ticketType
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [status, setStatus] = useState("Active");
  const [ticketType, setTicketType] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [tab, setTab] = useState("tickets"); // "tickets" or "stats"

  // Pulls all tickets from PostgreSQL and
  // re-renders tickets list on state change
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tickets");
        if (!response.ok) {
          throw new Error("Failed to fetch tickets");
        }

        const data = await response.json();
        if (!Array.isArray(data) || data.length < 1) {
          console.log(`No ticket data found: ${JSON.stringify(data)}`);
          setTickets([]);
        } else {
          setTickets(data);
          setDisplayTickets(data.filter((t) => t.status === "Active"));
        }
      } catch (err) {
        console.error("Error fetching tickets:", err);
      }
    };

    fetchTickets();
  }, []);

  // Debugging
  // Useful to check if new/updated tickets are displayed properly
  useEffect(() => {
    console.log(`Tickets: ${JSON.stringify(tickets)}`);
  }, [tickets]);

  // Debugging:
  // Check if `displayTickets` state is being updated normally
  useEffect(() => {
    console.log(`Display Tickets: ${JSON.stringify(displayTickets)}`);
  }, [displayTickets]);

  // Add or edit a ticket
  const handleAddOrEditTicket = async () => {
    try {
      // Pull all of the tickets from DB
      // and refresh state with updated fields
      const res = await fetch("http://localhost:5000/api/tickets");
      const updatedTickets = await res.json();

      setTickets(updatedTickets);
      let filteredTickets = [];
      // Filter and refresh based on ticketType and status
      if (ticketType == "All") {
        filteredTickets = updatedTickets.filter((t) => t.status === status);
      } else {
        filteredTickets = updatedTickets.filter(
          (t) => t.ticket_type === ticketType && t.status === status
        );
      }

      setDisplayTickets([...filteredTickets]);
    } catch (err) {
      console.error("Failed to refresh tickets after update:", err);
    }
  };

  // Resolve or Re-open a ticket
  const handleTicketStatusChange = async (id, currentStatus) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/tickets/status/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentStatus }),
        }
      );
      if (!res.ok) {
        console.log("Error using /PUT operation");
        throw new Error("Status update failed");
      }

      const updatedTicket = await res.json();
      setTickets(
        tickets.map((t) => (t.id === updatedTicket.id ? updatedTicket : t))
      );

      // Updated displayed tickets
      setDisplayTickets(displayTickets.filter((t) => t.id !== id));

      alert("Successfully updated status!");
    } catch (err) {
      console.log("err:", err);
      alert("Alert: Failed to change status of ticket");
    }
  };

  /* API Routing Calls */
  // Deletes ticket from DB
  const handleDeleteTicket = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tickets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete ticket");
      }
      setDisplayTickets(displayTickets.filter((t) => t.id !== id));
      alert(`Successfully deleted ticket ${id}`);
    } catch (e) {
      console.log(e);
      alert("Error deleting ticket");
    }
  };

  // Delete all displayed tickets from DB
  const handleDeleteAllTickets = async () => {
    // More efficient
    const idList = displayTickets.map((t) => Number(t.id));
    console.log(`Received ID list for deletion: ${idList}`);

    if (!Array.isArray(idList) || idList.length < 1) {
      console.log("There are no tickets to delete!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/tickets/delete-all`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idList }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete tickets");
      }

      setDisplayTickets([]);
      alert("All tickets deleted successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to delete tickets");
    }
  };

  // Filters displayed tickets by ticket type
  const handleTicketTypeChange = (event) => {
    if (event.target.value === "All")
      setDisplayTickets(tickets.filter((t) => t.status === status));
    else {
      setDisplayTickets(
        tickets.filter(
          (t) => t.ticket_type === event.target.value && t.status === status
        )
      );
    }
    setTicketType(event.target.value);
  };

  // Filters displayed tickets by status
  const handleStatusChange = (event) => {
    if (!Array.isArray(tickets)) {
      console.error("Expected tickets to be an array:", tickets);
      return;
    }
    if (ticketType === "All")
      setDisplayTickets(tickets.filter((t) => t.status === event.target.value));
    else
      setDisplayTickets(
        tickets.filter(
          (t) => t.status === event.target.value && t.ticket_type === ticketType
        )
      );

    setStatus(event.target.value);
  };

  const fieldLabels = {
    created_at: "Created At",
    created_by: "Created By",
    id: "ID",
    rental_id: "Rental Id",
    vehicle_id: "Vehicle Id",
    ticket_type: "Ticket type",
    notes: "Notes",
    resolved_at: "Resolved At",
    resolved_by: "Resolved By",
    status: "Status",
  };

  const renderTicketDetails = (ticket) => {
    const displayFields = Object.entries(ticket).filter(([key, value]) => {
      const notEmpty = value !== "" && value !== null && value !== undefined;
      return notEmpty && fieldLabels[key];
    });

    return (
      <ul>
        {displayFields.map(([key, value]) => (
          <li key={key}>
            <strong>{fieldLabels[key]}:</strong> {value}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h2>Car Rental Ticket Tracker</h2>

      {/* Use for later */
      /* <div className="tab-buttons">
        <button onClick={() => setTab("tickets")}>📄 Rental Tickets</button>
      </div> */}
      <div>
        <div>Ticket count: {displayTickets.length}</div>
        <label>
          Active or Resolved:
          <select
            name="isActive"
            defaultValue="Active"
            onChange={handleStatusChange}
            multiple={false}
          >
            <option value="Active">Active</option>
            <option value="Resolved">Resolved</option>
          </select>
        </label>
        <label>
          Ticket type:
          <select
            name="ticketType"
            defaultValue="All"
            onChange={handleTicketTypeChange}
            multiple={false}
          >
            <option value="All">All</option>
            <option value="Price adjustment">Price adjustment</option>
            <option value="EV charge">EV charge</option>
            <option value="Miles">Miles</option>
            <option value="Check-in">Check-in</option>
          </select>
        </label>
      </div>

      {tab === "tickets" && (
        <>
          <button onClick={() => setShowModal(true)}>Create Ticket</button>
          <button
            className="delete-all"
            onClick={() => handleDeleteAllTickets()}
          >
            Delete All Tickets
          </button>

          {showModal && (
            <TicketForm
              onClose={() => setShowModal(false)}
              onSave={handleAddOrEditTicket}
            />
          )}

          {selectedTicket && (
            <TicketForm
              ticket={selectedTicket}
              onSave={handleAddOrEditTicket}
              onClose={handleCancel}
            />
          )}

          {displayTickets.length === 0 && <p>No tickets to display.</p>}

          {[...displayTickets]
            .filter((t) => t.status === status)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map((ticket) => (
              <div key={ticket.id} className="rental-card">
                {renderTicketDetails(ticket)}
                <button onClick={() => handleEditTicket(ticket.id)}>
                  Edit
                </button>
                <button
                  className={
                    ticket.status === "Active" && status === "Active"
                      ? "resolve-button"
                      : "reopen-button"
                  }
                  onClick={() =>
                    handleTicketStatusChange(ticket.id, ticket.status)
                  }
                >
                  {ticket.status === "Active" && status === "Active"
                    ? "Mark as resolved"
                    : "Re-open ticket"}
                </button>
                <button onClick={() => handleDeleteTicket(ticket.id)}>
                  Delete
                </button>
              </div>
            ))}
        </>
      )}

      {/* {tab === "stats" && <StatsPanel tickets={tickets} />} */}
    </div>
  );
};

export default TicketList;
