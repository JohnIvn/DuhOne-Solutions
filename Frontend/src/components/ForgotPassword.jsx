import React, { useState, useEffect } from "react";
import { Container, Box, TextField, Button, Typography, Grid, IconButton, InputAdornment } from "@mui/material";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";  // Import useNavigate

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();  // Initialize useNavigate hook

  useEffect(() => {
    console.log("ForgotPassword component mounted");
  }, []);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setNewPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/forgot-password", {
        email,
        password: newPassword,
      });

      console.log("Password change response:", response.data);
      setError("");
      setEmail("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect to the /signin page after success
      navigate("/signin");  // Navigate to Sign-In page
    } catch (error) {
      console.error("Error during POST request:", error);
      setError("Error updating password. Please try again.");
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <Box
      sx={{
        height: "100vh", // Full height of the viewport
        width: "100%", // Full width of the viewport
        backgroundImage: 'url("https://media.istockphoto.com/id/1146367630/vector/abstract-navy-background.jpg?s=612x612&w=0&k=20&c=4odz8sgWFQHHwQ09ouonbKdvotg79421iCgJ8-99RyE=")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Grid container spacing={0} sx={{ bgcolor: "rgba(0, 0, 0, 0.7)", borderRadius: 2, padding: 4, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 4, borderRadius: "8px", width: "100%", maxWidth: 400, mx: "auto", backgroundColor: "rgba(28, 28, 28, 0.8)" }}>
            <Typography variant="h5" gutterBottom sx={{ color: "#ffffff", textAlign: "center" }}>
              Forgot Password
            </Typography>
            {error && <Typography variant="body2" sx={{ color: "#ff0000", textAlign: "center", mb: 2 }}>{error}</Typography>}

            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
                InputLabelProps={{ style: { color: "#ffffff" } }}
                InputProps={{ style: { color: "#ffffff" } }}
                sx={{ backgroundColor: "#2a2a2a", borderRadius: "5px" }}
              />

              <TextField
                label="New Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                variant="outlined"
                value={newPassword}
                onChange={handlePasswordChange}
                InputLabelProps={{ style: { color: "#ffffff" } }}
                InputProps={{
                  style: { color: "#ffffff" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ backgroundColor: "#2a2a2a", borderRadius: "5px" }}
              />

              <TextField
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                variant="outlined"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                InputLabelProps={{ style: { color: "#ffffff" } }}
                InputProps={{
                  style: { color: "#ffffff" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowConfirmPassword} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ backgroundColor: "#2a2a2a", borderRadius: "5px" }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  mb: 2,
                  backgroundColor: "#333",
                  color: "#ffffff",
                  "&:hover": {
                    backgroundColor: "#444",
                  },
                }}
              >
                Change Password
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ForgotPassword;
