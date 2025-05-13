import React from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

function TicketCard({ ticket, handleEdit, handleDelete }) {

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
        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            sx={{ backgroundColor: "#fff", color: "#000", '&:hover': { backgroundColor: "#f0f0f0" } }}
            onClick={() => handleEdit(ticket)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            sx={{ backgroundColor: "#fff", color: '#f44336', '&:hover': { backgroundColor: "#f0f0f0" } }}
            onClick={() => handleDelete(ticket.id)}
          >
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}


 export default TicketCard;