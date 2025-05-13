import React from "react";
import { Card, CardContent, Typography, Button, Stack } from "@mui/material";

function TicketCard({ ticket, handleEdit }) {

  return (
    <Card className="ticket-card" sx={{
      backgroundColor: (theme) => {
        const status = ticket.status.toLowerCase();
        if (status === 'open') return theme.palette.warning.light;
        if (status === 'in progress') return theme.palette.info.light;
        if (status === 'resolved') return theme.palette.success.light;
        if (status === 'closed') return theme.palette.error.light;
        return theme.palette.background.paper;
      },
      mb: 2,
      p: 2,
    }}>
      <CardContent>
        <Typography variant="h6">{ticket.title}</Typography>
        <Typography>{ticket.description}</Typography>
        <Typography>Ticket ID: {ticket.id}</Typography>
        <Typography>Status: {ticket.status}</Typography>
        <Typography>Ticket created: {ticket.created_at}</Typography>
        <Button onClick={() => handleEdit(ticket)} sx={{ mt : 2 }} variant="outlined">
          Edit
        </Button>
        <Button onClick={() => handleDelete(ticket)} sx={{ mt : 2 }} variant="outlined">
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}


 export default TicketCard;