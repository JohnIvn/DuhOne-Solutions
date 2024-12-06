import React, { useState } from 'react';
import { 
  Container, Box, TextField, Button, Typography, Link, Divider, Grid, IconButton, InputAdornment 
} from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { validateSignUpField, validateSignUpForm } from '../utilities/SignUpValidation';
import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx';

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

    if (isCooldown) return; // Prevent sending if in cooldown

    try {
      const response = await axios.post('http://localhost:3000/send-code', { email: formData.email });
      console.log(response.data.message);
      alert('Verification code sent to your email!');
      
      // Start cooldown with 30 seconds
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
    } catch (error) {
      console.error('Error sending verification code:', error);
      alert(error.response?.data?.message || 'Failed to send verification code');
    }
  };


  const handleVerifyCode = async () => {
    console.log('Email:', formData.email); 
    console.log('Verification Code:', verificationCode);
    
    if (!verificationCode) {
      alert('Please enter the verification code.');
      return;
    }

    try {
      // Add headers to ensure proper content type
      const response = await axios.post('http://localhost:3000/verify-code', { 
        email: formData.email, 
        code: verificationCode 
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Verification successful:', response.data.message);
      setIsCodeVerified(true);
      alert('Email successfully verified!');
    } catch (error) {
      console.error('Error verifying code:', error);
      alert(error.response?.data?.message || 'Verification failed. Please try again.');
    }
};



  return (
    <>
      <NavBar />
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          minHeight: '100vh',
          minWidth: '100%',
          marginTop: '4%',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Grid container spacing={0} sx={{ bgcolor: 'rgba(0, 0, 0, 0.7)', borderRadius: 2, padding: 4 }}>
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#ffffff' }}>
            <Typography variant="h4" gutterBottom>
              Join Us Today!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Create an account to get started.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 4, borderRadius: '8px', width: '100%', maxWidth: 400, mx: 'auto', backgroundColor: 'rgba(28, 28, 28, 0.8)' }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#ffffff', textAlign: 'center' }}>
                Sign up
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
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                  sx={{ backgroundColor: '#2a2a2a', borderRadius: '5px' }}
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
                  InputLabelProps={{ style: { color: '#ffffff' } }}
                  InputProps={{ style: { color: '#ffffff' } }}
                  sx={{ backgroundColor: '#2a2a2a', borderRadius: '5px' }}
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
                  InputLabelProps={{ style: { color: '#ffffff' } }}
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
                          disabled={isCooldown}  // Disable button during cooldown
                        >
                          {isCooldown ? `Wait ${countdown}s` : 'Send Code'}
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ backgroundColor: '#2a2a2a', borderRadius: '5px' }}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />

                {/* New Verification Code Field */}
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
                  sx={{ backgroundColor: '#2a2a2a', borderRadius: '5px' }}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
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
                  disabled={loading}
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </Button>
              </Box>
              <Divider sx={{ my: 3, bgcolor: '#555' }} />
              <Typography variant="body2" sx={{ color: '#bbbbbb', textAlign: 'center' }}>
                Already have an account?{' '}
                <Link href="/signin" sx={{ color: '#ffffff', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

export default SignUp;