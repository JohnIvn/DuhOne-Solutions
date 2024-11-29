import React, { useState } from 'react';
import { 
  Container, Box, TextField, Button, Typography, Link, Divider, Grid, IconButton, InputAdornment 
} from '@mui/material';
import { Google as GoogleIcon, Facebook as FacebookIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx'
import Footer from '../components/Footer.jsx';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
  
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/signin', formData);
  
      console.log("Response from backend:", response.data);  
  
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role); 
      console.log(localStorage.getItem('role'));
      console.log('Sign in successful:', response.data);
  
      if (response.data.redirectTo) {
        console.log('Redirecting to:', response.data.redirectTo); 
        navigate(response.data.redirectTo); 
      } else {
        console.log('Redirecting to homepage');
        navigate('/homepage'); 
      }
  
    } catch (error) {
      console.error('Error signing in:', error);
      setError(error.response?.data?.message || 'Failed to sign in. Please try again.');
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
        backgroundImage: 'url("https://media.istockphoto.com/id/1146367630/vector/abstract-navy-background.jpg?s=612x612&w=0&k=20&c=4odz8sgWFQHHwQ09ouonbKdvotg79421iCgJ8-99RyE=")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Grid container spacing={0} sx={{ bgcolor: 'rgba(0, 0, 0, 0.7)', borderRadius: 2, padding: 4 }}>
        <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', color: '#ffffff' }}>
          <Typography variant="h4" gutterBottom>
            Welcome Back!
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Please sign in to continue.
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 4, borderRadius: '8px', width: '100%', maxWidth: 400, mx: 'auto', backgroundColor: 'rgba(28, 28, 28, 0.8)' }}>
            <Typography variant="h5" gutterBottom sx={{ color: '#ffffff', textAlign: 'center' }}>
              Sign In
            </Typography>
            {error && (
              <Typography variant="body2" sx={{ color: '#ff0000', textAlign: 'center', mb: 2 }}>
                {error}
              </Typography>
            )}
            <Box component="form" noValidate autoComplete="off" onSubmit={handleSignIn}>
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                variant="outlined"
                error={!!error}
                helperText={error}
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
                error={!!error}
                helperText={error}
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
             <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, mb: 2, backgroundColor: '#333', color: '#000000' }}>
                Sign in
            </Button>
              <Typography variant="body2" sx={{ color: '#ffffff', textAlign: 'center' }}>
                Don't have an account? <Link href="/signup" variant="body2" sx={{ color: '#ffffff' }}>Sign up</Link>
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
                Sign in with Google
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
                Sign in with Facebook
              </Button>

              <Typography variant="body2" sx={{ color: '#ffffff', textAlign: 'center', mt: 2 }}>
                <Link href="/forgot-password" variant="body2" sx={{ color: '#ffffff' }}>
                  Forgot Password?
                </Link>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
    <Footer/>
    </>
  );
}

export default SignIn;
