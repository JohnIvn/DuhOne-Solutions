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
                  InputProps={{ style: { color: '#ffffff' } }}
                  sx={{ backgroundColor: '#2a2a2a', borderRadius: '5px' }}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
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
                  type="submit"  // This triggers form submission
                  variant="contained"
                  fullWidth
                  sx={{
                  mt: 2,
                  mb: 2,
                  backgroundColor: '#333',
                  color: '#000000',
                          }}
                  >
                  Sign Up
                  </Button>


                <Typography variant="body2" sx={{ color: '#ffffff', textAlign: 'center' }}>
                  Already have an account? <Link href="/signin" variant="body2" sx={{ color: '#ffffff' }}>Sign in</Link>
                </Typography>
                <Divider sx={{ my: 2, color: '#ffffff', backgroundColor: 'rgba(0, 0, 0, 0.01)' }}>or</Divider>
                <Button
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  fullWidth
                  sx={{
                    mb: 1,
                    color: '#ffffff',
                    borderColor: '#ffffff',
                    '&:hover': { backgroundColor: '#2a2a2a', borderColor: '#ffffff' },
                  }}
                >
                  Sign up with Google
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  fullWidth
                  sx={{
                    color: '#ffffff',
                    borderColor: '#ffffff',
                    '&:hover': { backgroundColor: '#2a2a2a', borderColor: '#ffffff' },
                  }}
                >
                  Sign up with Facebook
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default SignUp;