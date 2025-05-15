import React from "react";
import DeviceForm from "../components/DeviceForm";
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Paper, 
  ListItemIcon, 
  Chip,
  Box,
  Tooltip
} from "@mui/material";
import ComputerIcon from '@mui/icons-material/Computer';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import TabletIcon from '@mui/icons-material/Tablet';
import PrintIcon from '@mui/icons-material/Print';
import PersonIcon from '@mui/icons-material/Person';

function DeviceList({ devices, setDevices }) {
    const getDeviceIcon = (type) => {
        switch (type.toLowerCase()) {
            case 'laptop':
            case 'desktop':
            case 'computer':
                return <ComputerIcon sx={{ marginRight: 1 }}/>
            case 'phone':
            case 'cellphone':
                return <PhoneIphoneIcon sx={{ marginRight: 1 }}/>
            case 'tablet':
                return <TabletIcon sx={{ marginRight: 1 }}/>
            case 'printer':
                return <PrintIcon sx={{ marginRight: 1 }} />
            default:
                return null;
        }
    };

    return (
        <Paper sx={{ padding: 2, maxWidth: 800, margin: '0 auto' }}>
            <Typography variant="h6" gutterBottom>
                Device Inventory
            </Typography>
            <List>
                {devices.map((device) => (
                    <ListItem key={device.id} divider>
                        <ListItemIcon>
                            {getDeviceIcon(device.type)}
                        </ListItemIcon>
                        <ListItemText 
                            primary={device.name}
                            secondary={
                                <>
                                    <Typography component="span" variant="body2">
                                        Type: {device.type} | SN#{device.serial_number}
                                    </Typography>
                                    
                                    {device.users && device.users.length > 0 && (
                                        <Box sx={{ mt: 1 }}>
                                            <Typography component="span" variant="body2" sx={{ mr: 1 }}>
                                                Users:
                                            </Typography>
                                            {device.users.map(user => (
                                                <Tooltip 
                                                    key={user.id} 
                                                    title={`${user.tickets.length} ticket(s)`}
                                                >
                                                    <Chip
                                                        icon={<PersonIcon />}
                                                        label={user.username}
                                                        size="small"
                                                        sx={{ mr: 0.5, mb: 0.5 }}
                                                    />
                                                </Tooltip>
                                            ))}
                                        </Box>
                                    )}
                                </>
                            }
                        />
                    </ListItem>
                ))}
            </List>
            <DeviceForm setDevices={setDevices}/>
        </Paper>
    )
}

export default DeviceList;