import React from 'react';
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import DevicesIcon from '@mui/icons-material/Devices';

function NavBar({ user, setUser, setUserDevices }) {
    function handleLogoutClick() {
        fetch("/logout", { method: "DELETE"}).then((r) => {
            if (r.ok) {
                setUser(null);
                setUserDevices([]);
            }
        });
    }
    
    return (
        <AppBar position="static" color="primary">
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DevicesIcon sx={{ fontSize: 32, mr: 1 }} />
                    <Typography variant="h6" component="div">
                        Device Management System
                    </Typography>
                </Box>
                <Box>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/my-devices"
                    >
                        My Devices
                    </Button>
                    <Button 
                        color="inherit" 
                        component={Link} 
                        to="/devices"
                    >
                        Device Inventory
                    </Button>
                    <Button 
                        color="inherit" 
                        onClick={handleLogoutClick}
                    >
                        Logout
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default NavBar;