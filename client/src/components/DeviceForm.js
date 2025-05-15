import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Box, Button, TextField, Typography } from "@mui/material";

// Validation schema
const formSchema = yup.object().shape({
  name: yup.string().required("Must enter device's name").max(15, "Name should be less than 15 characters"),
  type: yup.string().required("Must enter type of device"),
  serial_number: yup
    .number()
    .positive()
    .integer()
    .required("Must enter serial number")
    .typeError("Please enter a valid integer"),
});

function DeviceForm({ setDevices }) {

  // Formik setup
  const formik = useFormik({
    initialValues: {
      name: "",
      type: "",
      serial_number: "",
    },
    validationSchema: formSchema,
    onSubmit: (values) => {
      console.log("Form values submitted: ", values);  // Added logging
      fetch("/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => {
          console.log("Response status: ", response.status);  // Log the response status
          if (response.ok) {
            response.json().then((newDevice) => {
                console.log("New Device:", newDevice); 
                setDevices(prev => [...prev,newDevice]);
                formik.resetForm();
            });
          } else {
            // Handle server-side errors or non-200 responses
            console.error("Failed to submit the form, response not ok");
          }
        })
        .catch((error) => {
          // Log any network-related errors (e.g., fetch failure)
          console.error("Error occurred during the fetch:", error);
        });
    },
  });

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3, border: "1px solid #ccc", borderRadius: 2, backgroundColor: "#fff" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Add a New Device
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          label="Device Name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Device Type"
          name="type"
          value={formik.values.type}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.type && Boolean(formik.errors.type)}
          helperText={formik.touched.type && formik.errors.type}
          sx={{ mb: 2 }}
        />

        <TextField
          fullWidth
          label="Serial Number"
          name="serial_number"
          value={formik.values.serial_number}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.serial_number && Boolean(formik.errors.serial_number)}
          helperText={formik.touched.serial_number && formik.errors.serial_number}
          sx={{ mb: 2 }}
        />

        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Submit Device
        </Button>
      </form>
    </Box>
  );
}

export default DeviceForm;
