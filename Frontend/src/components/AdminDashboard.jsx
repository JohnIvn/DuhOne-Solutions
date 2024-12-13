import React, { useState } from "react";
import { Button, Box, Typography, createTheme, ThemeProvider, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50", // Green
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#2196F3", // Blue
      contrastText: "#FFFFFF",
    },
    success: {
      main: "#FF5722", // Orange
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#9C27B0", // Purple
      contrastText: "#FFFFFF",
    },
  },
});

const AdminNavDashboard = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  // Function to handle navigation
  const handleNavigation = (page) => {
    console.log(`Navigating to: /${page}`);
    navigate(`/${page}`);
  };

  // Dropdown menu open/close handlers
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/signin');
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "30px",
          mt: "30px",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleNavigation("Admin-Portal")}
        >
          Subscriptions
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleNavigation("Admin-Portal/Users")}
        >
          Accounts
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleNavigation("suspended")}
        >
          Suspended
        </Button>
        
        {/* Dropdown Button for Logout */}
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClick}
        >
          Account
        </Button>
        
        {/* Menu Dropdown for Logout */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </ThemeProvider>
  );
};

export default AdminNavDashboard;
