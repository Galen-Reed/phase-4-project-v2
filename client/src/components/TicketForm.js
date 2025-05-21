import React from "react";
import { TextField, Button, MenuItem, Box, Grid } from "@mui/material";
import { Formik, Form } from "formik";

function TicketForm({ onSubmit, devices, initialData = null, preselectedDeviceId = null, onCancel }) {
  const initialValues = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    device_id: initialData?.device_id || preselectedDeviceId || "",
    status: initialData?.status || "open",
  };

  const validate = (values) => {
    const errors = {};
    
    if (!values.title.trim()) {
      errors.title = "Title is required";
    }

    if (!values.description.trim()) {
      errors.description = "Description is required";
    } else if (values.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }

    if (!values.device_id) {
      errors.device_id = "Please select a device";
    }

    return errors;
  };

  const handleSubmit = (values, { resetForm }) => {
    onSubmit(values);
    if (!initialData) {
      resetForm();
    }
  };

  console.log(initialData);

  return (
    <Formik initialValues={initialValues} validate={validate} onSubmit={handleSubmit} enableReinitialize={true}>
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Ticket Title"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                multiline
                rows={4}
                error={touched.description && !!errors.description}
                helperText={touched.description ? errors.description : "Minimum 10 characters"}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                margin="normal"
                select
                label="Device"
                name="device_id"
                value={values.device_id}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.device_id && !!errors.device_id}
                helperText={touched.device_id && errors.device_id}
                disabled={!!initialData || preselectedDeviceId !== null}
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
                  margin="normal"
                  select
                  label="Status"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  onBlur={handleBlur}
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
        </Form>
      )}
    </Formik>
  );
}

export default TicketForm;