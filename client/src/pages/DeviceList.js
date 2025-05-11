import React from "react";
import DeviceForm from "../components/DeviceForm";
import { List, ListItem, ListItemText, Typography, Paper, ListItemIcon } from "@mui/material";
import ComputerIcon from '@mui/icons-material/Computer';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TabletIcon from '@mui/icons-material/Tablet';

function DeviceList({ devices, setDevices }) {

    const getDeviceIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'laptop':
            case 'desktop':
            case 'computer':
                return <ComputerIcon sx={{ marginRight: 1 }}/>
            case 'phone':
                return <PhoneIphoneIcon sx={{ marginRight: 1 }}/>
            case 'tablet':
                return <TabletIcon sx={{ marginRight: 1 }}/>
            default:
                return null;
        }
    };

    console.log(devices);

    return (
        <Paper sx={{ padding: 2, maxWidth: 800, margin: '0 auto' }}>
            <Typography variant="h6" gutterBottom>
                Inventory Sheet
            </Typography>
            <List>
            {devices.map((device) => (
                <ListItem key={device.id} divider>
                    <ListItemIcon>
                        {getDeviceIcon(device.type)}
                    </ListItemIcon>
                    <ListItemText 
                        primary={device.name}
                        secondary={`Type: ${device.type} | SN#${device.serial_number}`}
                    />
                </ListItem>
            ))}
            </List>
            <DeviceForm setDevices={setDevices}/>
        </Paper>
    )
}

export default DeviceList;
