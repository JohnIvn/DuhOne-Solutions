import React, { useState, useEffect } from 'react';
import { Container, Box, TextField, Button, Typography, Grid, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [verificationCodeError, setVerificationCodeError] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address.');
    } else {
      setEmailError('');
    }
  }, [email]);

  useEffect(() => {
    if (newPassword && newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
    } else {
      setPasswordError('');
    }
  }, [newPassword]);

  useEffect(() => {
    if (verificationCode && verificationCode.length < 6) {
      setVerificationCodeError('Verification code must be at least 6 characters.');
    } else {
      setVerificationCodeError('');
    }
  }, [verificationCode]);

  const handleSendCode = async () => {
    if (!email) {
      alert('Please enter a valid email');
      return;
    }

    if (isCooldown) return;

    try {
      const response = await axios.post('http://localhost:3000/validateEmail', { email });
      if (response.data.exist) {
        const sendCodeResponse = await axios.post('http://localhost:3000/send-code', { email });
        if (sendCodeResponse.status === 200) {
          setIsCooldown(true);
          setCountdown(30);

          const interval = setInterval(() => {
            setCountdown((prev) => {
              if (prev === 1) {
                clearInterval(interval);
                setIsCooldown(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);

          alert('Verification email has been sent! Please check your email.');
        } else {
          alert('Failed to send verification code');
        }
      } else {
        setEmailError('Email does not exist in our records');
        alert('Email does not exist in our records');
      }
    } catch (error) {
      console.error('Error validating email existence or sending code:', error);
      alert(error.response?.data?.message || 'Failed to validate email or send verification code');
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!verificationCode || verificationCodeError) {
      alert('Please enter a valid verification code.');
      return;
    }

    try {
      const emailResponse = await axios.post('http://localhost:3000/validateEmail', { email });
      if (emailResponse.data.exist) {
        const codeResponse = await axios.post('http://localhost:3000/verify-code', { email, code: verificationCode });
        
        if (codeResponse.status === 200) {
          const resetResponse = await axios.post('http://localhost:3000/forgot-password', { email, password: newPassword });
          alert('Password successfully reset!');
          navigate('/signin');
        } else {
          alert('Invalid or expired verification code.');
        }
      } else {
        alert('Email does not exist.');
      }
    } catch (error) {
      console.error('Error during password reset:', error);
      alert(error.response?.data?.message || 'Failed to reset password. Please try again.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ display: 'flex', minHeight: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Grid container spacing={2} sx={{ bgcolor: 'rgba(0, 0, 0, 0.7)', borderRadius: 2, padding: 4, maxWidth: 500 }}>
        <Grid item xs={12}>
          <Box sx={{ p: 4, borderRadius: '8px', width: '100%', backgroundColor: 'rgba(28, 28, 28, 0.8)' }}>
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
                error={!!emailError}
                helperText={emailError}
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
                error={!!verificationCodeError}
                helperText={verificationCodeError}
              />
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 1,
                  backgroundColor: '#007bff',
                  color: '#ffffff',
                }}
                onClick={handleSendCode}
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
                error={passwordError.length > 0}
                helperText={passwordError}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  backgroundColor: '#007bff',
                  color: '#ffffff',
                }}
                disabled={passwordError !== '' || emailError !== '' || verificationCodeError !== ''}
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
