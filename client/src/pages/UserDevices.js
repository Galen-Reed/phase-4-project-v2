import React, { useState } from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TicketCard from "../components/TicketCard";
import TicketForm from "../components/TicketForm";

function UserDevices({ user, userDevices, setUserDevices, allDevices, setAllDevices }) {
  const [ticketToEdit, setTicketToEdit] = useState(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [showTicketForm, setShowTicketForm] = useState(false);

  function handleEdit(ticket) {
    setTicketToEdit(ticket);
    setSelectedDeviceId(ticket.device_id);
    setShowTicketForm(true);
  }

  function handleDelete(ticketId, deviceId) {
  fetch(`/tickets/${ticketId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        const updatedDevices = userDevices
          .map(device => {
            if (device.id === deviceId) {
              const filteredTickets = device.tickets.filter(t => t.id !== ticketId);
              return {
                ...device,
                tickets: filteredTickets
              };
            }
            return device;
          })
          .filter(device => device.tickets.length > 0); // 👈 removes devices with no tickets

        setUserDevices(updatedDevices);
      } else {
        console.error("Failed to delete ticket");
      }
    });
}

  function handleAddTicket(device) {
    setTicketToEdit(null);
    setSelectedDeviceId(device.id);
    setShowTicketForm(true);
  }

  function handleCancelTicketForm() {
    setTicketToEdit(null);
    setShowTicketForm(false);
  }

  function handleSubmit(ticketData) {
    const method = ticketToEdit ? "PATCH" : "POST";
    const url = ticketToEdit ? `/tickets/${ticketToEdit.id}` : "/tickets";

    fetch(url, {
      method,
      headers: { 'Content-Type': "application/json" },
      body: JSON.stringify(ticketData),
    })
      .then((r) => r.json())
      .then((savedTicket) => {
        const deviceId = savedTicket.device_id;
        const updatedDevices = [...userDevices];
        const deviceIndex = updatedDevices.findIndex(d => d.id === deviceId);
        
        if (ticketToEdit) {
          if (deviceIndex >= 0) {
            const ticketIndex = updatedDevices[deviceIndex].tickets.findIndex(t => t.id === savedTicket.id);
            if (ticketIndex >= 0) {
              updatedDevices[deviceIndex].tickets[ticketIndex] = savedTicket;
            }
          }
        } else {
          if (deviceIndex >= 0) {
            updatedDevices[deviceIndex].tickets.push(savedTicket);
          } else {
            const device = allDevices.find(d => d.id === deviceId);
            if (device) {
              updatedDevices.push({
                ...device,
                tickets: [savedTicket]
              });
            }
          }
        }
        
        setUserDevices(updatedDevices);
        setTicketToEdit(null);
        setShowTicketForm(false);
      });
  }

  return (
    <Box sx={{ padding: 2, maxWidth: 900, margin: "0 auto" }}>
      <Typography variant="h5" gutterBottom>
        {user.username}'s Devices
      </Typography>

      {userDevices.length === 0 ? (
        <Typography variant="body1" sx={{ mb: 2 }}>
          You don't have any devices yet. Create a ticket for a device to add it to your collection.
        </Typography>
      ) : (
        userDevices.map((device) => (
          <Accordion key={device.id} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">
                {device.name} ({device.type})
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Serial Number: {device.serial_number}
                </Typography>
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Your Tickets for this Device:
                </Typography>
                
                {device.tickets && device.tickets.length > 0 ? (
                  device.tickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      handleEdit={handleEdit}
                      handleDelete={(ticketId) => handleDelete(ticketId, device.id)}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No tickets for this device yet.
                  </Typography>
                )}
                
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => handleAddTicket(device)}
                >
                  Add Ticket for this Device
                </Button>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
      
      <Box sx={{ mt: 4 }}>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => {
            setTicketToEdit(null);
            setSelectedDeviceId(null);
            setShowTicketForm(true);
          }}
          sx={{ mb: 2 }}
        >
          Create Ticket for a New Device
        </Button>
        
        {showTicketForm && (
          <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
            <Typography variant="h6" gutterBottom>
              {ticketToEdit ? "Edit Ticket" : "Create New Ticket"}
            </Typography>
            <TicketForm 
              onSubmit={handleSubmit} 
              devices={allDevices}
              initialData={ticketToEdit} 
              preselectedDeviceId={selectedDeviceId}
              onCancel={handleCancelTicketForm}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default UserDevices;