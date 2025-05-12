import React from "react";
import { Box, Typography } from "@mui/material";
import TicketCard from "../components/TicketCard";
import TicketForm from "../components/TicketForm";

function UserTickets({ tickets, setTickets, devices }) {

    function onSubmit(ticketData) {
        fetch("/tickets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(ticketData),
        })
        .then((response) => response.json())
        .then((newTicket) => {
            setTickets([...tickets, newTicket]);
        })
        .catch((error) => {
            console.error("Error creating ticket:", error);
        });
    };


  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" gutterBottom>
        Your Tickets
      </Typography>

      {tickets.length === 0 ? (
        <Typography variant="body1" sx={{ mb: 2 }}>
          No tickets found for this user.
        </Typography>
      ) : (
        tickets.map((ticket) => (
          <TicketCard key={ticket.id} ticket={ticket} />
        ))
      )}
      <Box sx={{ mt: 4 }}>
        <TicketForm onSubmit={onSubmit} devices={devices}/>
      </Box>
    </Box>
  );
}

export default UserTickets;
