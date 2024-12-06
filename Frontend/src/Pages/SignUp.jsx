import React, { useState } from 'react';
import { 
  Container, Box, TextField, Button, Typography, Link, Divider, IconButton, InputAdornment 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { validateSignUpField, validateSignUpForm } from '../utilities/SignUpValidation';
import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';
import SettingsIcon from '@mui/icons-material/Settings';
import BuildIcon from '@mui/icons-material/Build';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import FiveGIcon from '@mui/icons-material/FiveG';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeVerified, setIsCodeVerified] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));

    const fieldError = validateSignUpField(field, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [field]: fieldError,
    }));
  };

  const handleSignUp = async (event) => {
    event.preventDefault();

    const formErrors = validateSignUpForm(formData);
    setErrors(formErrors);

    if (Object.values(formErrors).some((error) => error)) {
      setError('Please fill up all fields!');
      return;
    }

    if (!isCodeVerified) {
      setError('Please verify your email before signing up.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/signup', formData);
      console.log('Sign up successful:', response.data);
      navigate('/signin');
    } catch (error) {
      console.error('Error signing up:', error);
      setError(error.response?.data?.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!formData.email) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: 'Email is required',
      }));
      return;
    }

    if (isCooldown) return;

    try {
      const response = await axios.post('http://localhost:3000/send-code', { email: formData.email });
      alert('Verification code sent to your email!');
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
        email: formData.email, 
        code: verificationCode 
      });
      alert('Email successfully verified!');
      setIsCodeVerified(true);
    } catch (error) {
      console.error('Error verifying code:', error);
      alert(error.response?.data?.message || 'Verification failed. Please try again.');
    }
  };

  return (
    <>
      <NavBar />

      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          background: "linear-gradient(to bottom right, #051b36, #000000)",
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',
            p: 5,
            pl: 10,
            pr: 10,
            borderRadius: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            ml: 0,
          }}
        >
          <Typography variant="h4" align="center" sx={{ mb: 2, color: '#ffffff', fontWeight: 'bold' }}>
            Join us Today!
          </Typography>
          <Typography variant="body2" align="center" sx={{ mb: 4, color: '#e0e0e0' }}>
            Create an account to get started.
          </Typography>
          {error && (
            <Typography variant="body2" sx={{ color: '#ff0000', textAlign: 'center', mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box component="form" noValidate autoComplete="off" onSubmit={handleSignUp}>
            <TextField
              label="First Name"
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.firstName}
              helperText={errors.firstName}
              InputLabelProps={{ style: { color: '#bdbdbd' } }}
              InputProps={{ style: { color: '#ffffff' } }}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
            />
            <TextField
              label="Last Name"
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.lastName}
              helperText={errors.lastName}
              InputLabelProps={{ style: { color: '#bdbdbd' } }}
              InputProps={{ style: { color: '#ffffff' } }}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
              InputLabelProps={{ style: { color: '#bdbdbd' } }}
              InputProps={{
                style: { color: '#ffffff' },
                endAdornment: (
                  <InputAdornment position="end">
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        backgroundColor: '#333',
                        color: '#ffffff',
                        '&:hover': { backgroundColor: '#555' },
                      }}
                      onClick={handleSendCode}
                      disabled={isCooldown}
                    >
                      {isCooldown ? `Wait ${countdown}s` : 'Send Code'}
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <TextField
              label="Verification Code"
              fullWidth
              margin="normal"
              variant="outlined"
              InputLabelProps={{ style: { color: '#bdbdbd' } }}
              InputProps={{ style: { color: '#ffffff' } }}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
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
              disabled={isCodeVerified}
            >
              {isCodeVerified ? 'Verified' : 'Verify Code'}
            </Button>
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              margin="normal"
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password}
              InputLabelProps={{ style: { color: '#ffffff' } }}
              InputProps={{
                style: { color: '#ffffff' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '8px' }}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
                color: '#ffffff',
                borderRadius: '8px',
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': { background: 'linear-gradient(to right, #ff4b2b, #ff416c)' },
              }}
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </Box>
          <Divider sx={{ my: 3, bgcolor: '#555' }} />
          <Typography variant="body2" sx={{ color: '#bbbbbb', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link href="/signin" sx={{ color: '#ff4b2b', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default SignUp;
