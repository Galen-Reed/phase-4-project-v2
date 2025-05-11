import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

function TicketCard({ ticket }) {

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
        <Typography>Device: {ticket.device.id}</Typography>
        <Typography>Ticket created: {ticket.created_at}</Typography>
      </CardContent>
    </Card>
  );
}


 export default TicketCard;