import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import TicketCard from "../components/TicketCard";
import TicketForm from "../components/TicketForm";

function UserDevices({ user, tickets, setTickets, devices }) {
  const [ticketToEdit, setTicketToEdit] = useState(null);
  const [userDevices, setUserDevices] = useState({});

  useEffect(() => {
    // Group tickets by devices
    const groupedDevices = {};
    tickets.forEach((ticket) => {
      const deviceId = ticket.device_id;
      if (!groupedDevices[deviceId]) {
        groupedDevices[deviceId] = {
          device: ticket.device,
          tickets: []
        };
      }
      groupedDevices[deviceId].tickets.push(ticket);
    });
    setUserDevices(groupedDevices);
  }, [tickets]);

  function handleEdit(ticket) {
    setTicketToEdit(ticket);
  }

  function handleDelete(ticketId) {
    fetch(`/tickets/${ticketId}`, {
      method: "DELETE",
    })
    .then((response) => {
      if (response.ok) {
        const updated = tickets.filter((t) => t.id !== ticketId);
        setTickets(updated);
      } else {
        console.error("Failed to delete ticket");
      }
    });
  }

  function handleSubmit(ticketData) {
    const method = ticketToEdit ? "PATCH" : "POST";
    const url = ticketToEdit ? `/tickets/${ticketToEdit.id}` : "/tickets";

    fetch(url, {
      method,
      headers: {'Content-Type': "application/json" },
      body: JSON.stringify(ticketData),
    })
    .then((r) => r.json())
    .then((savedTicket) => {
      if(ticketToEdit) {
        const updated = tickets.map((t) => (t.id === savedTicket.id ? savedTicket : t));
        setTickets(updated);
        setTicketToEdit(null);
      } else {
        setTickets([...tickets, savedTicket]);
      }
    });
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        {user.username}'s Tickets
      </Typography>

      {Object.keys(userDevices).length === 0 ? (
        <Typography variant="body1" sx={{ mb: 2 }}>
          No devices with tickets found for this user.
        </Typography>
      ) : (
        Object.keys(userDevices).map((deviceId) => (
          <Box key={deviceId} sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Device: {userDevices[deviceId].device.name}
            </Typography>
            {userDevices[deviceId].tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            ))}
          </Box>
        ))
      )}
      
      <Box sx={{ mt: 4 }}>
        <TicketForm onSubmit={handleSubmit} devices={devices} initialData={ticketToEdit} />
      </Box>
    </Box>
  );
}

export default UserDevices;
