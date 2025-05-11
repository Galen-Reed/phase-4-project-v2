import React from 'react';
import { Field, Form, Formik } from 'formik';
import { Button, TextField, Typography, Box, Grid, MenuItem } from '@mui/material';
import * as Yup from 'yup';

// Validation schema
const validationSchema = Yup.object({
    title: Yup.string()
        .min(3, 'Title should be at least 3 characters long')
        .required('Title is required'),
    description: Yup.string()
        .min(10, 'Description should be at least 10 characters long')
        .required('Description is required'),
    status: Yup.string()
        .oneOf(['open', 'closed', 'in progress'], 'Invalid status')
        .required('Status is required'),
    device_id: Yup.number()
        .required('Device is required')
});

const TicketForm = ({ onSubmit, devices }) => {
    return (
        <Formik
            initialValues={{
                title: '',
                description: '',
                status: 'open',
                device_id: '',
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
            {({ values, handleChange, handleBlur, touched, errors }) => (
                <Form>
                    <Box
                        sx={{
                            maxWidth: 600,
                            mx: 'auto',
                            mt: 4,
                            p: 3,
                            border: '1px solid #ccc',
                            borderRadius: 2,
                            backgroundColor: '#fff',
                        }}
                    >
                        <Typography variant="h4" component="h1" gutterBottom>
                            Create New Ticket
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Field
                                    name="title"
                                    label="Title"
                                    variant="outlined"
                                    fullWidth
                                    as={TextField}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.title}
                                    error={touched.title && Boolean(errors.title)}
                                    helperText={touched.title && errors.title}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    name="description"
                                    label="Description"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    as={TextField}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                    error={touched.description && Boolean(errors.description)}
                                    helperText={touched.description && errors.description}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    name="device_id"
                                    label="Device"
                                    variant="outlined"
                                    fullWidth
                                    select
                                    as={TextField}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.device_id}
                                    error={touched.device_id && Boolean(errors.device_id)}
                                    helperText={touched.device_id && errors.device_id}
                                >
                                    {devices.map((device) => (
                                        <MenuItem key={device.id} value={device.id}>
                                            {device.name}
                                        </MenuItem>
                                    ))}
                                </Field>
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    name="status"
                                    label="Status"
                                    variant="outlined"
                                    fullWidth
                                    select
                                    as={TextField}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.status}
                                    error={touched.status && Boolean(errors.status)}
                                    helperText={touched.status && errors.status}
                                >
                                    <MenuItem value="open">Open</MenuItem>
                                    <MenuItem value="in progress">In Progress</MenuItem>
                                    <MenuItem value="closed">Closed</MenuItem>
                                </Field>
                            </Grid>
                        </Grid>

                        <Box mt={3}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Submit Ticket
                            </Button>
                        </Box>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};

export default TicketForm;
