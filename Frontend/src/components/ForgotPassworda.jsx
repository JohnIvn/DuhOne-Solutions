import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, Grid, InputAdornment, IconButton } from '@mui/material';
import { Password, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState(''); // To store password error message
  const navigate = useNavigate();

  useEffect(() => {
    // Validate the new password length
    if (newPassword.length > 0 && newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }
  }, [newPassword]);

  const handleSendCode = async () => {
    if (!email) {
      alert('Please enter a valid email');
      return;
    }

    if (isCooldown) return; // Prevent sending if in cooldown

    try {

      
      const existing = await axios.post('http://localhost:3000/forgot-password', {email, password: newPassword})
      if(!existing.data.exists){
        const response = await axios.post('http://localhost:3000/send-code', { email });
        setIsCooldown(true);
        setCountdown(30);
  
        const interval = setInterval(() => {
          setCountdown((prev) => {
            if (prev === 1) {
              clearInterval(interval);  // Clear the interval once the countdown ends
              setIsCooldown(false);     // Reset cooldown
              return 0;
            }
            return prev - 1;
          });
        }, 1000);  // Update countdown every second
      } 
      alert('Verification code sent to your email!');

   
    } catch (error) {
      console.error('Error sending verification code:', error);
      alert(error.response?.data?.message || 'Failed to send verification code');
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      alert('Please enter the verification code.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/verify-code', { 
        email, 
        code: verificationCode 
      });
      console.log('Verification successful:', response.data.message);
      setIsCodeVerified(true);
      alert('Email successfully verified!');
    } catch (error) {
      console.error('Error verifying code:', error);
      alert(error.response?.data?.message || 'Verification failed. Please try again.');
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!isCodeVerified) {
      setError('Please verify your email before resetting your password.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/forgot-password', { 
        email, 
        password: newPassword
      });
      console.log('Password reset successful:', response.data.message);
      alert('Password successfully reset!');
      navigate('/signin');
    } catch (error) {
      console.error('Error resetting password:', error);
      setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ display: 'flex', minHeight: '100vh', marginTop: '4%' }}>
      <Grid container spacing={2} sx={{ bgcolor: 'rgba(0, 0, 0, 0.7)', borderRadius: 2, padding: 4 }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#ffffff' }}>
          <Typography variant="h4" gutterBottom>
            Forgot Password
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Enter your email to reset your password.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 4, borderRadius: '8px', width: '100%', maxWidth: 400, mx: 'auto', backgroundColor: 'rgba(28, 28, 28, 0.8)' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#ffffff', textAlign: 'center' }}>
              Reset Password
            </Typography>
            {error && (
              <Typography variant="body2" sx={{ color: '#ff0000', textAlign: 'center', mb: 2 }}>
                {error}
              </Typography>
            )}
            <Box component="form" noValidate autoComplete="off" onSubmit={handleResetPassword}>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ style: { color: '#ffffff' } }}
                InputProps={{ style: { color: '#ffffff' } }}
                sx={{ backgroundColor: '#2a2a2a', borderRadius: '5px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label="Verification Code"
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ style: { color: '#ffffff' } }}
                InputProps={{ style: { color: '#ffffff' } }}
                sx={{ backgroundColor: '#2a2a2a', borderRadius: '5px' }}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  backgroundColor: isCodeVerified ? '#28a745' : '#333',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: isCodeVerified ? '#218838' : '#555' },
                }}
                onClick={handleVerifyCode}
                disabled={isCodeVerified} // Disable button if code is verified
              >
                {isCodeVerified ? 'Verified' : 'Verify Code'}
              </Button>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: '#007bff',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#0056b3' },
                }}
                onClick={handleSendCode}  // Send Code Button
                disabled={isCooldown}
              >
                {isCooldown ? `Resend in ${countdown}s` : 'Send Code'}
              </Button>

              <TextField
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                variant="outlined"
                InputLabelProps={{ style: { color: '#ffffff' } }}
                InputProps={{
                  style: { color: '#ffffff' },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ backgroundColor: '#2a2a2a', borderRadius: '5px' }}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={passwordError.length > 0}  // Set error state if password is invalid
                helperText={passwordError}  // Display error message below the input
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: '#007bff',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#0056b3' },
                }}
                disabled={passwordError !== ''}
              >
                Reset Password
              </Button>
            </Box>
            <Grid container justifyContent="center" sx={{ mt: 2 }}>
              <Button variant="text" color="secondary" onClick={() => navigate('/signin')}>
                Back to Sign In
              </Button>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ForgotPassword;
