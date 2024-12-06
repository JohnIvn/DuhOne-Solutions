import React, { useEffect, useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom"; 

const AdminDashboard = () => {
    const navigate = useNavigate(); 
    const handleNavigation = (page) => {
        navigate(`/${page}`); 
    };

    return (
        <div>
            {}
            <Box sx={{ textAlign: "center", marginBottom: "20px" }}>
                <Typography variant="h4">Admin Dashboard</Typography>
            </Box>

            {}
            <Box sx={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "30px" }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleNavigation("clients")}
                >
                    Clients
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleNavigation("general")}
                >
                    General
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleNavigation("sales")}
                >
                    Sales
                </Button>
                <Button
                    variant="contained"
                    color="warning"
                    onClick={() => handleNavigation("statistics")}
                >
                    Statistics
                </Button>
            </Box>

            {}
        </div>
    );
};

export default AdminDashboard;
