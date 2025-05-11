import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignUpForm from "../components/SignUpForm";
import { Divider, Button, Box, Typography } from "@mui/material";

function Login({ onLogin }) {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        border: "1px solid #ccc",
        borderRadius: 2,
        textAlign: "center",
        backgroundColor: "#fff",
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Ticketing System
      </Typography>

      {showLogin ? (
        <>
          <LoginForm onLogin={onLogin} />
          <Divider sx={{ my: 2 }} />
          <p>
            Don't have an account? &nbsp;
            <Button color="secondary" onClick={() => setShowLogin(false)}>
              Sign Up
            </Button>
          </p>
        </>
      ) : (
        <>
          <SignUpForm onLogin={onLogin} />
          <Divider sx={{ my: 2 }} />
          <p>
            Already have an account? &nbsp;
            <Button color="secondary" onClick={() => setShowLogin(true)}>
              Log In
            </Button>
          </p>
        </>
      )}
    </Box>
  );
}

export default Login;
