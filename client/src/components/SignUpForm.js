import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

function SignUpForm({ onLogin }) {
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      passwordConfirmation: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required(),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm your password"),
      imageUrl: Yup.string().url("Invalid URL"),
      bio: Yup.string(),
    }),
    onSubmit: (values) => {
      setIsLoading(true);
      setErrors([]);
      fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
          password_confirmation: values.passwordConfirmation,
          image_url: values.imageUrl,
          bio: values.bio,
        }),
      }).then((r) => {
        setIsLoading(false);
        if (r.ok) {
          r.json().then((user) => onLogin(user));
        } else {
          r.json().then((err) => setErrors(err.errors || ["Sign up failed"]));
        }
      });
    },
  });

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >
      <Typography variant="h5" align="center">
        Sign Up
      </Typography>

      <TextField
        label="Username"
        id="username"
        {...formik.getFieldProps("username")}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
        fullWidth
      />

      <TextField
        label="Password"
        type="password"
        id="password"
        {...formik.getFieldProps("password")}
        error={formik.touched.password && Boolean(formik.errors.password)}
        helperText={formik.touched.password && formik.errors.password}
        fullWidth
      />

      <TextField
        label="Confirm Password"
        type="password"
        id="passwordConfirmation"
        {...formik.getFieldProps("passwordConfirmation")}
        error={
          formik.touched.passwordConfirmation &&
          Boolean(formik.errors.passwordConfirmation)
        }
        helperText={
          formik.touched.passwordConfirmation && formik.errors.passwordConfirmation
        }
        fullWidth
      />

      <Button
        variant="contained"
        color="primary"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : "Sign Up"}
      </Button>

      {errors.length > 0 &&
        errors.map((err, index) => (
          <Alert severity="error" key={index}>
            {err}
          </Alert>
        ))}
    </Box>
  );
}

export default SignUpForm;
