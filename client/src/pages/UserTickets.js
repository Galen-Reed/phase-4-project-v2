import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import TicketCard from "../components/TicketCard";
import TicketForm from "../components/TicketForm";

function UserTickets({ user, tickets, setTickets, devices }) {

    const [ticketToEdit, setTicketToEdit] = useState(null);

    // function handleSubmit(ticketData) {
    //     fetch("/tickets", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(ticketData),
    //     })
    //     .then((response) => response.json())
    //     .then((newTicket) => {
    //         setTickets([...tickets, newTicket]);
    //     })
    //     .catch((error) => {
    //         console.error("Error creating ticket:", error);
    //     });
    // };

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

    console.log(tickets);


  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        {user.username}'s Tickets
      </Typography>

      {tickets.length === 0 ? (
        <Typography variant="body1" sx={{ mb: 2 }}>
          No tickets found for this user.
        </Typography>
      ) : (
        tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} handleEdit={handleEdit} handleDelete={handleDelete}/>
        ))
      )}
      <Box sx={{ mt: 4 }}>
        <TicketForm onSubmit={handleSubmit} devices={devices} initialData={ticketToEdit}/>
      </Box>
    </Box>
  );
}

export default UserTickets;
