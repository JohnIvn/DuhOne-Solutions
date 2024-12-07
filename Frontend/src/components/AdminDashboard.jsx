import React from "react";
import { Button, Box, Typography, createTheme, ThemeProvider } from "@mui/material";
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

  const handleNavigation = (page) => {
    navigate(`/${page}`);
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
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleNavigation("clients")}
        >
          Clients
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={() => handleNavigation("suspended")}
        >
          Suspended
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default AdminNavDashboard;
