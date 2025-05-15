import React, { useState } from "react";
import { TextField, Button, MenuItem, Box, Grid } from "@mui/material";

function TicketForm({ onSubmit, devices, initialData = null, preselectedDeviceId = null, onCancel }) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    device_id: preselectedDeviceId || initialData?.device_id || "",
    status: initialData?.status || "open",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    
    if (!formData.device_id) {
      newErrors.device_id = "Please select a device";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit(formData);
      
      // Only reset form if not editing
      if (!initialData) {
        setFormData({
          title: "",
          description: "",
          device_id: preselectedDeviceId || "",
          status: "open",
        });
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Ticket Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            required
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            rows={4}
            error={!!errors.description}
            helperText={errors.description || "Minimum 10 characters"}
            required
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            select
            label="Device"
            name="device_id"
            value={formData.device_id}
            onChange={handleChange}
            error={!!errors.device_id}
            helperText={errors.device_id}
            disabled={preselectedDeviceId !== null}
            required
          >
            {devices.map((device) => (
              <MenuItem key={device.id} value={device.id}>
                {device.name} ({device.type})
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        {initialData && (
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <MenuItem value="open">Open</MenuItem>
              <MenuItem value="in progress">In Progress</MenuItem>
              <MenuItem value="closed">Closed</MenuItem>
            </TextField>
          </Grid>
        )}
        
        <Grid item xs={12}>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            {onCancel && (
              <Button type="button" variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="contained">
              {initialData ? "Update Ticket" : "Create Ticket"}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TicketForm;